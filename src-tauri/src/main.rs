// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct DeviceState {
    usb: bool,
    headphone: String,
}

impl Default for DeviceState {
    fn default() -> Self {
        Self {
            usb: false,
            headphone: "Disconnected".to_string(),
        }
    }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn save_device_state(usb: bool, headphone: String, app_handle: tauri::AppHandle) -> Result<(), String> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;
    
    // Create the directory if it doesn't exist
    fs::create_dir_all(&app_dir).map_err(|e| format!("Failed to create app directory: {}", e))?;
    
    let config_path = app_dir.join("device_state.json");
    let state = DeviceState { usb, headphone };
    
    let json_string = serde_json::to_string_pretty(&state)
        .map_err(|e| format!("Failed to serialize state: {}", e))?;
    
    fs::write(config_path, json_string)
        .map_err(|e| format!("Failed to write state file: {}", e))?;
    
    Ok(())
}

#[tauri::command]
async fn load_device_state(app_handle: tauri::AppHandle) -> Result<DeviceState, String> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;
    
    let config_path = app_dir.join("device_state.json");
    
    if !config_path.exists() {
        return Ok(DeviceState::default());
    }
    
    let json_string = fs::read_to_string(config_path)
        .map_err(|e| format!("Failed to read state file: {}", e))?;
    
    let state: DeviceState = serde_json::from_str(&json_string)
        .map_err(|e| format!("Failed to deserialize state: {}", e))?;
    
    Ok(state)
}

#[tauri::command]
async fn get_system_info() -> Result<String, String> {
    let os = std::env::consts::OS;
    let arch = std::env::consts::ARCH;
    Ok(format!("OS: {}, Architecture: {}", os, arch))
}

#[tauri::command]
async fn toggle_usb_device() -> Result<String, String> {
    // This is a placeholder function where you could implement actual USB device control
    // For now, it just returns a success message
    Ok("USB device toggled successfully".to_string())
}

#[tauri::command]
async fn set_headphone_config(config: String) -> Result<String, String> {
    // This is a placeholder function where you could implement actual headphone configuration
    // For now, it just returns a success message
    match config.as_str() {
        "3 Pin" | "4 Pin" | "Disconnected" => {
            Ok(format!("Headphone configuration set to: {}", config))
        }
        _ => Err("Invalid headphone configuration".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            save_device_state,
            load_device_state,
            get_system_info,
            toggle_usb_device,
            set_headphone_config
        ])
        .setup(|app| {
            // You can add initialization code here
            println!("USB & Headphone Controller started successfully!");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}