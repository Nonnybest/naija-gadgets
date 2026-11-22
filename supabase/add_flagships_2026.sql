-- Insert 2026 Flagship Gadgets into ng_products
INSERT INTO ng_products (name, category, price, stock, image_url, description, featured)
VALUES
  ('OBSBOT Meet 2 AI 4K Webcam', 'Sensors, Lab & Workshop Gadgets', 185000, 15, '/products/obsbot-meet-2.png', 'AI-powered 4K webcam featuring phase detection autofocus, HDR imaging, and intuitive gesture-based zoom controls.', true),
  ('eufyMake E1 Desktop UV 3D Texture Printer', 'Sensors, Lab & Workshop Gadgets', 640000, 8, '/products/eufymake-e1.png', 'Personal UV printer that creates rich tactile 3D embossed textures on wood, acrylic, glass, and metal.', true),
  ('ESR CryoBoost 3-in-1 Foldable MagSafe Dock', 'Wearables, AR & Smart Rings', 95000, 25, '/products/esr-cryoboost-3in1.png', 'Fast magnetic wireless charging station for phone, watch, and earbuds with active CryoBoost cooling fan.', true),
  ('VITURE Beast 174-inch Virtual OLED XR Glasses', 'Wearables, AR & Smart Rings', 720000, 6, '/products/viture-beast.jpg', 'High-end augmented reality glasses offering an immersive 174-inch virtual display experience for gaming and movies.', true),
  ('ASUS ZenWiFi BQ16 Pro Wi-Fi 7 Mesh System', 'Smart Home & Matter Hubs', 580000, 10, '/products/asus-zenwifi-bq16-pro.jpg', 'Quad-band subscription-free Wi-Fi 7 mesh system delivering up to 30 Gbps with 10Gbps dual Ethernet backhaul.', true),
  ('Nintendo Switch 2 Hybrid Gaming Console', 'Drones, Gimbal & Robotics', 495000, 12, '/products/nintendo-switch-2.jpg', 'Next-generation hybrid console featuring magnetic Joy-Cons, vibrant high-refresh display, and 4K dock output.', true)
ON CONFLICT DO NOTHING;
