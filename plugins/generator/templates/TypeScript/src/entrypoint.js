"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disable = exports.enable = void 0;
/**
 * Used by Croakerr to initialize the plugin.
 * @param {PluginInterface} linker - The linking variable between Croakerr and your plugin.
 * See Plugins#PluginInterface in the documentation for more.
 *
 * This method is required, plugins missing this method will not be initialized, and will not receive event data.
 */
function enable({ croakerr, logger }) {
    croakerr.registerListener("some.event", (data) => {
        logger.log(data);
    });
}
exports.enable = enable;
/**
 * Used by Croakerr to disable the plugin.
 * Allowing the plugin to handle graceful shutdown practices.
 * This method is optional.
 */
function disable() {
    // Do some stuff to create a graceful shutdown.
}
exports.disable = disable;
