import json
import random

categories = {
    "Raspberry Pi & Single Board Computers": [
        ("Raspberry Pi 5 {ram}GB Extreme AI Kit", 145000, 220000, "Includes 26 TOPS Hailo-8L M.2 AI accelerator, active cooler, official power supply, Wi-Fi 6E and Bluetooth 5.0."),
        ("Raspberry Pi Compute Module 5 {ram}GB with Dual PCIe Baseboard", 115000, 185000, "Industrial-grade CM5 with dual Gigabit Ethernet, NVMe M.2 slot, Wi-Fi 6E and BLE 5.3."),
        ("Orange Pi 5 Max {ram}GB Octa-Core RK3588", 130000, 195000, "8K video processing, 6 TOPS NPU, dual 2.5G LAN, Wi-Fi 6E and Bluetooth 5.2 for edge compute."),
        ("Khadas VIM4 Neural Edge Computer {ram}GB", 160000, 240000, "Amlogic A311D2 octa-core, HDMI input/output, OOWOW cloud boot, Wi-Fi 6 MIMO and Bluetooth 5.3."),
        ("NVIDIA Jetson Orin Nano Developer Kit {ram}GB", 380000, 520000, "40 TOPS AI performance for autonomous robotics, computer vision, with Wi-Fi/BT M.2 module."),
        ("BeagleV-Ahead RISC-V 64-bit Compute Board", 95000, 140000, "Quad-core Alibaba T-Head TH1520 RISC-V SoC with 4 TOPS NPU, Wi-Fi 5 and Bluetooth 5.0 BLE."),
        ("Radxa Rock 5B Plus {ram}GB Single Board Computer", 140000, 210000, "RK3588 with triple display support, 2.5GbE, M.2 M-Key and E-Key for Wi-Fi 6/BT."),
        ("Coral Dev Board Micro with Edge TPU", 85000, 125000, "Dual-core ARM Cortex with Google Coral Edge TPU ML accelerator and Wi-Fi/Bluetooth LE."),
        ("ESP32-S3 Dual-Core AI Vision Dev Kit with OLED", 24000, 38000, "Dual-core Xtensa 240MHz, 8MB PSRAM, Wi-Fi 4 + BLE 5.0 Mesh with onboard 2MP camera."),
        ("Seeed Studio reTerminal DM Industrial Touch SBC", 210000, 295000, "10.1 inch IP65 industrial panel PC based on CM4 with CAN bus, RS485, Wi-Fi and Bluetooth.")
    ],
    "Smart Locks & Biometric Access": [
        ("3D Structured Light Face-Recognition Smart Door Lock {model}", 185000, 290000, "Infrared 3D biometric face recognition, fingerprint, Wi-Fi app remote unlock, Tuya & Matter."),
        ("Palm Vein Biometric Deadbolt with Smart Video Doorbell", 210000, 320000, "Contactless sub-dermal vein scanner, 2K built-in camera, two-way audio, Wi-Fi and Bluetooth."),
        ("Matter & Apple HomeKey Certified Smart Deadbolt {model}", 165000, 245000, "Tap to unlock with iPhone/Apple Watch, Thread/Matter protocol, auto-lock sensor."),
        ("Heavy-Duty Waterproof Fingerprint Gate Lock with Keypad", 95000, 145000, "IP68 outdoor stainless steel smart lock for gates, Bluetooth 5.0 and Wi-Fi gateway included."),
        ("Smart Glass Door Dual-Sided Fingerprint Lock {model}", 88000, 135000, "Frameless glass door electronic lock, RFID cards, remote password generation, Bluetooth app."),
        ("Tuya Wi-Fi Smart Cabinet & Drawer Biometric Lock", 28000, 42000, "Hidden installation RFID and Bluetooth/Wi-Fi lock for safes, cupboards and office drawers."),
        ("Automated Motorized Deadbolt with Proximity Geofencing", 125000, 185000, "Auto-unlocks as you approach via Bluetooth LE, hands-free grocery mode and Wi-Fi log tracking."),
        ("Commercial RFID & PIN Smart Mortise Lock {model}", 110000, 160000, "Heavy-duty security lock for apartments and hotels, audit trail logging, Bluetooth 5.2.")
    ],
    "Hacking, SDR & Radio Tools": [
        ("Flipper Zero Cyber Multitool with Wi-Fi Devboard V2", 210000, 310000, "Sub-GHz transceiver, RFID 125kHz, NFC, IR, Bluetooth LE, and Wi-Fi penetration testing board."),
        ("HackRF One SDR with PortaPack H2 Bundle", 195000, 280000, "1MHz to 6GHz software-defined radio transceiver with battery pack, antennas, and Mayhem firmware."),
        ("Proxmark3 RDV4.01 RFID / NFC Analysis Tool", 165000, 235000, "Industry standard RFID research device for HF/LF transponders with Bluetooth battery extension."),
        ("WiFi Pineapple Mark VII Enterprise Pentest Kit", 240000, 340000, "Dual-band 2.4/5GHz automated rogue AP detection, PineAP suite, and Bluetooth remote management."),
        ("Ubertooth One 2.4GHz Bluetooth Sniffer & Dev Tool", 88000, 130000, "Open-source 2.4GHz wireless development platform for Bluetooth experimentation and analysis."),
        ("ESP32 Marauder Wi-Fi & Bluetooth Offensive Security Suite", 45000, 72000, "Handheld wireless auditing device with touch display, GPS tracking, and packet capture tools."),
        ("KrakenSDR 5-Channel Coherent Software Defined Radio", 420000, 580000, "Five RTL-SDR receivers for phase-coherent radio direction finding, passive radar and RF mapping."),
        ("ChameleonUltra RFID / NFC Emulator Keychain", 78000, 115000, "High/Low frequency multi-card emulator with Bluetooth LE smartphone app control.")
    ],
    "Drones, Gimbal & Robotics": [
        ("DJI Mini 4 Pro Smart Drone with O4 FHD Video Transmission", 520000, 680000, "Omnidirectional obstacle sensing, 20km Wi-Fi 6 video link, ActiveTrack 360, 4K/60fps HDR."),
        ("Autel EVO Nano+ AI Obstacle Sensing Drone", 395000, 510000, "Compact drone with 50MP camera, PDAF+CDAF focus, Wi-Fi 6 ground station, 3-axis gimbal."),
        ("LiDAR AI Vision Robot Vacuum with Dual Spinning Mops", 285000, 395000, "6000Pa suction, obstacle 3D avoidance, self-emptying dock, Wi-Fi app with 3D home map."),
        ("Bionic Quadruped Robotic Pet Companion with HD Camera", 310000, 450000, "AI terrain navigation, voice interaction, Wi-Fi remote patrol, facial tracking and gesture response."),
        ("DJI Osmo Mobile 6 Smart AI Tracking Gimbal", 98000, 135000, "ActiveTrack 6.0, built-in extension rod, magnetic clamp, Bluetooth 5.1 and gesture controls."),
        ("Underwater ROV Drone with 4K UHD Camera and Wi-Fi Buoy", 480000, 640000, "100m depth rating, 4000 lumen LED headlights, real-time wireless video stream to tablet."),
        ("Smart AI Window Cleaning Robot with Dual Ultrasonic Spray", 115000, 165000, "Laser edge detection, 3800Pa vacuum suction, Bluetooth remote and smartphone app controls.")
    ],
    "Smart Home & Matter Hubs": [
        ("Universal Matter / Thread Multi-Protocol Smart Gateway", 48000, 75000, "Bridges Zigbee, Thread, BLE and Matter devices to Home Assistant, Google Home, Apple Home."),
        ("Smart Motorized Roller Blind Controller with Solar Panel", 38000, 58000, "Converts manual blinds to smart blinds, light sensor automation, Bluetooth & Wi-Fi control."),
        ("Smart Automatic Water Shutoff Valve with Leak Sensors", 65000, 95000, "Motorized pipe valve with 3 wireless water detectors, Wi-Fi emergency push notification."),
        ("Smart Circuit Breaker IoT Energy Meter 63A", 42000, 64000, "Real-time voltage, current, and kWh monitor, overload protection, Wi-Fi remote control."),
        ("Matter Smart Thermostat with Wireless Remote Sensors", 85000, 125000, "Touch glass display, room presence sensors, adaptive scheduling via Wi-Fi and Bluetooth."),
        ("Smart Fingerbot Robot Mechanical Button Pusher Bundle", 26000, 42000, "Presses physical wall switches and appliance buttons remotely via Bluetooth & Zigbee gateway.")
    ],
    "Smart Security & Surveillance": [
        ("4K Solar Dual-Lens PTZ Outdoor Security Camera", 85000, 130000, "Color night vision, human auto-tracking, dual Wi-Fi antenna, 360-degree pan-tilt, solar battery."),
        ("2K Dual-Camera Video Doorbell with Radar Presence Detection", 72000, 110000, "Package detection camera, radar motion alerts, two-way audio, dual-band Wi-Fi and chime."),
        ("Thermal Imaging Night Patrol Camera with AI Detection", 240000, 350000, "Dual optical/thermal sensor, perimeter breach warnings, Wi-Fi live streaming and siren alarm."),
        ("PIR Wireless Outdoor Strobe Siren with Matter Integration", 34000, 52000, "115dB solar alarm siren, flashing LED beacon, tamper switch, Wi-Fi & Zigbee compatible.")
    ],
    "Wearables, AR & Smart Rings": [
        ("Titanium Biometric Smart Health Ring Gen 4", 125000, 185000, "Continuous PPG heart rate, sleep phase staging, body temperature, SpO2, Bluetooth LE, 7-day battery."),
        ("Next-Gen AR Smart HUD Audio Glasses", 165000, 240000, "Micro-OLED heads-up display, directional spatial sound, AI voice translation, Bluetooth 5.4."),
        ("Bone Conduction Bluetooth 5.4 Sports Headset with MP3", 42000, 65000, "Open-ear acoustic safety, IP68 fully waterproof, 32GB internal storage and dual-device BLE pairing."),
        ("EEG Smart Sleep & Focus Neuro-Tracking Headband", 175000, 260000, "Brainwave biofeedback, guided meditation stimulation, sleep induction, Bluetooth 5.3.")
    ],
    "Sensors, Lab & Workshop Gadgets": [
        ("Wireless Smart Multi-Probe BBQ Thermometer 150m Range", 58000, 88000, "Dual ambient and internal temperature sensors, ceramic handle, Bluetooth 5.2 and cloud sync."),
        ("Smart Radon & VOC Indoor Air Quality Monitor with E-Ink", 78000, 115000, "Real-time radon, CO2, humidity, and particle tracking, Matter enabled, Wi-Fi connectivity."),
        ("Solar Smart Soil Moisture & NPK Sensor Kit", 36000, 54000, "Automated irrigation trigger, soil temperature, nitrogen/phosphorus/potassium telemetry via Wi-Fi."),
        ("Smart Digital Bluetooth Vernier Caliper 150mm", 32000, 48000, "Micron precision, wireless data logging directly to spreadsheet or CAD via Bluetooth HID."),
        ("Smart Portable Mini Soldering Iron with OLED & Bluetooth", 45000, 68000, "PD 100W fast heating, temperature profiles, smartphone telemetry and Bluetooth firmware updates.")
    ]
}

# Image mapping
image_pool = [
    "/products/raspberry-pi-5-ai.jpg",
    "/products/flipper-zero.jpg",
    "/products/smart-biometric-lock.jpg",
    "/products/smart-hud-glasses.jpg",
    "/products/matter-thread-hub.jpg",
    "/products/dji-smart-drone.jpg",
    "/products/smart-pet-feeder.jpg",
    "/products/smart-air-monitor.jpg",
    "/products/robot-vacuum-lidar.jpg",
    "/products/smart-ring-tracker.jpg",
    "/products/wireless-meat-probe.jpg",
    "/products/smart-plant-irrigator.jpg",
]

category_image_map = {
    "Raspberry Pi & Single Board Computers": "/products/raspberry-pi-5-ai.jpg",
    "Smart Locks & Biometric Access": "/products/smart-biometric-lock.jpg",
    "Hacking, SDR & Radio Tools": "/products/flipper-zero.jpg",
    "Drones, Gimbal & Robotics": "/products/dji-smart-drone.jpg",
    "Smart Home & Matter Hubs": "/products/matter-thread-hub.jpg",
    "Smart Security & Surveillance": "/products/smart-air-monitor.jpg",
    "Wearables, AR & Smart Rings": "/products/smart-ring-tracker.jpg",
    "Sensors, Lab & Workshop Gadgets": "/products/wireless-meat-probe.jpg"
}

ram_options = ["4", "8", "16", "32"]
model_codes = ["Pro", "Max", "Ultra", "Elite", "Series 5", "X1", "GT", "Prime", "Nano", "Edge"]
connectivity_features = [
    "Wi-Fi 6E (6GHz) & Bluetooth 5.4 Dual-Mode",
    "Sub-GHz Radio, NFC & Bluetooth LE Mesh",
    "Matter, Thread & Zigbee 3.0 Universal Bridge",
    "Wi-Fi 7 (320MHz) Tri-Band with Low Latency",
    "Dual-Band Wi-Fi 6 & Bluetooth 5.3 Proximity Sensing",
    "Gigabit Wi-Fi & Bluetooth Auracast Broadcast Audio"
]

items = []
target_count = 500
item_id = 1

while len(items) < target_count:
    for cat_name, templates in categories.items():
        if len(items) >= target_count:
            break
        tmpl_name, min_p, max_p, base_desc = random.choice(templates)
        ram = random.choice(ram_options)
        model = random.choice(model_codes)
        ver = f"v{random.randint(2, 6)}.{random.randint(0, 9)}"
        conn = random.choice(connectivity_features)

        p_name = tmpl_name.replace("{ram}", ram).replace("{model}", model)
        if "{model}" not in tmpl_name and "{ram}" not in tmpl_name:
            p_name = f"{p_name} ({model} - {ver})"

        # Deduplicate names
        existing_names = {x["name"] for x in items}
        suffix = 2
        orig_name = p_name
        while p_name in existing_names:
            p_name = f"{orig_name} Ed. #{suffix}"
            suffix += 1

        price = round(random.randint(min_p, max_p) / 500) * 500
        stock = random.randint(4, 80)
        img = category_image_map.get(cat_name, image_pool[item_id % len(image_pool)])
        desc = f"{base_desc} [Connectivity: {conn}]."
        featured = (len(items) < 32)

        items.append({
            "name": p_name,
            "category": cat_name,
            "price": price,
            "stock": stock,
            "image_url": img,
            "description": desc,
            "featured": featured
        })
        item_id += 1

print(f"Generated {len(items)} distinct products.")

# Generate SQL insert statements in batches of 50
sql_lines = [
    "-- 500 Distinct 2026 Advanced Smart Tech Products",
    "DELETE FROM ng_products;",
    ""
]

for batch_start in range(0, len(items), 50):
    batch = items[batch_start:batch_start+50]
    sql_lines.append("INSERT INTO ng_products (name, category, price, stock, image_url, description, featured) VALUES")
    val_strs = []
    for item in batch:
        escaped_name = item['name'].replace("'", "''")
        escaped_desc = item['description'].replace("'", "''")
        val_strs.append(
            f"('{escaped_name}', '{item['category']}', {item['price']}, {item['stock']}, '{item['image_url']}', '{escaped_desc}', {'true' if item['featured'] else 'false'})"
        )
    sql_lines.append(",\n".join(val_strs) + ";\n")

with open("supabase/seed_500.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

with open("lib/products_seed.json", "w", encoding="utf-8") as f:
    json.dump(items, f, indent=2)

print("Saved seed_500.sql and products_seed.json successfully.")
