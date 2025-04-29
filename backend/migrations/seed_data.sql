USE crm_invoicer;

INSERT INTO clients (name, company, address, email, phone, notes) VALUES
('Alice Smith','Acme Corp','123 Main St','alice@acme.com','123-456-7890','Preferred client'),
('Bob Jones','Beta LLC','456 Oak Ave','bob@beta.com','987-654-3210',NULL);

INSERT INTO services (sku, description, unit_price, tax_rate) VALUES
('SVC001','Web Design',1200.00,15.00),
('SVC002','Consulting',250.00,10.00);