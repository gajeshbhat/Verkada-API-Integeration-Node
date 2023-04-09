-- Create 'stores' table to store information about each store
CREATE TABLE stores (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    zip VARCHAR(20)
) ENGINE=InnoDB;

-- Create an index on name for faster searches by store name
CREATE INDEX idx_stores_name ON stores(name);

-- Create 'cameras' table to store information about each camera in the stores
CREATE TABLE cameras (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    camera_id VARCHAR(100) NOT NULL,
    store_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create an index on store_id for faster lookups of cameras by store
CREATE INDEX idx_cameras_store_id ON cameras(store_id);

-- Create 'points_of_service' table to store information about each point of service within the stores
CREATE TABLE points_of_service (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pos_id VARCHAR(100) NOT NULL,
    pos_name VARCHAR(100) NOT NULL,
    store_id INT UNSIGNED NOT NULL,
    camera_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create indexes on store_id and camera_id for faster lookups by store and camera
CREATE INDEX idx_points_of_service_store_id ON points_of_service(store_id);
CREATE INDEX idx_points_of_service_camera_id ON points_of_service(camera_id);

-- Create 'transactions' table to store information about each transaction
CREATE TABLE transactions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    transaction_date DATETIME NOT NULL,
    pos_id INT UNSIGNED NOT NULL,
    thumbnail_url VARCHAR(200),
    footage_url VARCHAR(200),
    FOREIGN KEY (pos_id) REFERENCES points_of_service(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create an index on transaction_id and pos_id for faster lookups by transaction id and point of service
CREATE INDEX idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX idx_transactions_pos_id ON transactions(pos_id);

-- Create 'transaction_items' table to store information about each item sold in a transaction
CREATE TABLE transaction_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT UNSIGNED NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_price FLOAT NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create an index on transaction_id for faster lookups by transaction
CREATE INDEX idx_transaction_items_transaction_id ON transaction_items(transaction_id);

-- Create 'camera_event_uids' table to store camera event unique identifiers
CREATE TABLE camera_event_uids (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_type_uid VARCHAR(50) UNIQUE NOT NULL,
    event_type_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Create a unique index on event_type_name for faster lookups by event type name
CREATE UNIQUE INDEX idx_camera_event_uids_event_type_name ON camera_event_uids(event_type_name);
