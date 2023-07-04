use super::func::Func;
use crate::func::FuncConfig;
use log::{debug, info};
use std::sync::Arc;

// The confige may be changed dynamically, so we need to use Arc to wrap it.
/// Wrapper for `Config`.
pub type ConfigWrapper = Arc<Config>;

/// Config for ai-assistant.
pub struct Config {
    pub funcs: Vec<Func>,
    // ... other fields
}

impl Config {
    /// Load config from json file.
    pub fn load_from_json_file(path: &str) -> Self {
        debug!("load config from file: {}", path);
        let file_content = std::fs::read_to_string(path).unwrap();
        let func_config: FuncConfig = serde_json::from_str(&file_content).unwrap();

        // Maybe we can use version to support different version of config.
        // match func_config.version.as_str() {
        //     "v1" => {
        //         // ...
        //     },
        //     _ => panic!("unsupported version")
        // }

        let mut config = Self { funcs: Vec::new() };
        for func in func_config.functions {
            debug!("load function {}", func.get_info().name);
            config.add_func(func);
        }
        info!("load config {} functions", config.funcs.len());
        config
    }

    /// Get a list of functions.
    ///
    /// Use `f` to convert `SpecFunc` to `T`, so that we can filter some fields user should not see.
    pub fn get_func_list<T, F>(&self, f: F) -> Vec<T>
    where
        F: FnMut(&Func) -> T,
    {
        self.funcs.iter().map(f).collect()
    }

    pub fn add_func(&mut self, func: Func) {
        self.funcs.push(func);
    }

    pub fn get_func(&self, name: &str) -> Option<&Func> {
        self.funcs.iter().find(|func| func.get_info().name == name)
    }
}
