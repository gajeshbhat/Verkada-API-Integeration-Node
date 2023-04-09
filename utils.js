const { INVENTORY_API_URL, 
  CAMERA_API_URL, 
  POS_API_URL, 
  STORE_API_URL, 
  VERKADA_API_KEY, 
  SALES_API_URL, 
  } = require('./constants');

// Initilize the db from models.js
const db = require('./models');

// Import the CameraEventUID model from models.js
const { CameraEventUID } = require('./models');

const axios = require('axios');
const fetch = import('node-fetch');


// Utility Functions
 async function fetchData(url, params = {}) {
  const response = await axios.get(url, { params });
  return response.data;
}

 async function fetchItem(item_id) {
    return await fetchData(`${INVENTORY_API_URL}/${item_id}`);
  }
  
  async function fetchCamera(camera_id) {
    return await fetchData(`${CAMERA_API_URL}/${camera_id}`);
  }
  
  async function fetchPos(pos_id) {
    return await fetchData(`${POS_API_URL}/${pos_id}`);
  }
  
  async function fetchStore(store_id) {
    return await fetchData(`${STORE_API_URL}/${store_id}`);
  }


async function getFootageLink(camera_id, timestamp) {
    const response = await axios.get(
      `${CAMERA_API_URL}/${camera_id}/footage?timestamp=${timestamp}`,
      { headers: { 'x-api-key': VERKADA_API_KEY } }
    );
    return response.data.url;
  }
  
async function getThumbnailLink(camera_id, timestamp, expiry) {
    const response = await axios.get(
      `${CAMERA_API_URL}/${camera_id}/thumbnail?timestamp=${timestamp}&expiry=${expiry}`,
      { headers: { 'x-api-key': VERKADA_API_KEY } }
    );
    return response.data.url;
}

// Functions to connect to the Sales API and Integerate with Verkada Helix API
async function storeData(transactions) {
  for (const transaction of transactions) {
    const { items, ...transactionData } = transaction;
    const [createdTransaction] = await transaction.findOrCreate({ where: { transactionId: transactionData.transactionId }, defaults: transactionData });
    
    for (const item of items) {
      const transactionItemData = { ...item, transactionId: createdTransaction.id };
      await transactionItemData.findOrCreate({ where: { itemId: item.itemId, transactionId: createdTransaction.id }, defaults: transactionItemData });
    }
  }
}

  async function fetchTransactions() {
    const response = await fetchData(SALES_API_URL);
    const transactions = response.data;
    return transactions;
  }
  
async function fetchAndStoreData() {
    const transactions = await fetchTransactions();
    await storeData(transactions);
  
    for (const transaction of transactions) {
      for (const item of transaction.items) {
        const camera = await fetchCamera(transaction.cameraId);
        await createAndPostVerkadaEvent(transaction, item, camera);
      }
    }
}
  
// Verkada API Functions to deal with Events
async function createAndPostVerkadaEvent(transaction, item, camera) {
  if (!transaction || !item || !camera) {
    return;
  }

  const eventTypeName = "Sales Transactions";
  let eventTypeUidEntry = await CameraEventUID.query.filter_by(eventTypeName).first();

  if (!eventTypeUidEntry) {
    const eventType = {
      event_schema: {
        item_id: "integer",
        transaction_id: "integer",
        transaction_time: "integer",
        thumbnail_url: "string",
        footage_url: "string"
      },
      name: eventTypeName
    };
    const eventTypeData = await postToVerkadaHelixEventType(eventType);

    if (eventTypeData) {
      const eventTypeUid = eventTypeData.uid;
      const newEventUidEntry = new CameraEventUID(eventTypeUid, eventTypeName);
      await db.session.add(newEventUidEntry);
      await db.session.commit();
    } else {
      return;
    }
  } else {
    let eventTypeUid = eventTypeUidEntry.eventTypeUid;
  }

  const transactionTimestamp = parseInt(transaction.transaction_date.timestamp() * 1000);

  const thumbnailLink = await getThumbnailLink(camera.camera_id, transactionTimestamp);
  const footageLink = await getFootageLink(camera.camera_id, transactionTimestamp);

  if (thumbnailLink && footageLink) {
    const transactionEntry = await Transaction.query.get(transaction.transaction_id);
    transactionEntry.thumbnail_link = thumbnailLink;
    transactionEntry.footage_link = footageLink;
    await db.session.commit();
  }

  const eventData = {
    camera_id: camera.camera_id,
    event_type_uid: eventTypeUid,
    time_ms: transactionTimestamp,
    attributes: {
      item_id: transaction.item_id,
      transaction_id: transaction.transaction_id,
      transaction_time: transactionTimestamp,
      thumbnail_url: thumbnailLink,
      footage_url: footageLink
    }
  };
  await postToVerkadaHelixEvent(eventData);
}

// Post to Verkada Helix API
async function postToVerkadaHelixEvent(eventData) {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": VERKADA_API_KEY
  };
  const url = `https://api.verkada.com/cameras/v1/video_tagging/event?org_id=${VERKADA_ORG_ID}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(eventData)
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      console.error(`Error posting data to Verkada Helix: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error posting data to Verkada Helix: ${error}`);
    return null;
  }
}

// Verkada API Functions to deal with Event Types
async function postToVerkadaHelixEventType(eventType) {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": VERKADA_API_KEY
  };
  const url = `https://api.verkada.com/cameras/v1/video_tagging/event_type?org_id=${VERKADA_ORG_ID}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(eventType)
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      console.error(`Error posting data to Verkada Helix: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error posting data to Verkada Helix: ${error}`);
    return null;
  }
}
  
// Export functions
module.exports = {
fetchAndStoreData,
fetchTransactions,
storeData,
fetchItem,
fetchCamera,
fetchPos,
fetchStore,
postToVerkadaHelixEvent,
postToVerkadaHelixEventType,
getFootageLink,
getThumbnailLink,
fetchData,
createAndPostVerkadaEvent,
}