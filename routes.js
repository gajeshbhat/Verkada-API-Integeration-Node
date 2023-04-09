// Import functions from utils used here
const {
    fetchItem,
    fetchCamera,
    fetchPos,
    fetchStore,
    getFootageLink,
  } = require("./utils");

// Routes
  
   app.get("/items/:item_id", async (req, res) => {
    const { item_id } = req.params;
    const itemDetails = await fetchItem(item_id);
    res.json(itemDetails);
  });
  
  app.get("/cameras/:camera_id", async (req, res) => {
    const { camera_id } = req.params;
    const cameraDetails = await fetchCamera(camera_id);
    res.json(cameraDetails);
  });
  
  app.get("/pos/:pos_id", async (req, res) => {
    const { pos_id } = req.params;
    const posDetails = await fetchPos(pos_id);
    res.json(posDetails);
  });
  
  app.get("/stores/:store_id", async (req, res) => {
    const { store_id } = req.params;
    const storeDetails = await fetchStore(store_id);
    res.json(storeDetails);
  });
  
  app.get("/footage", async (req, res) => {
    const { camera_id, timestamp } = req.query;
    const footageURL = await getFootageLink(camera_id, timestamp);
    res.json({ url: footageURL });
  });