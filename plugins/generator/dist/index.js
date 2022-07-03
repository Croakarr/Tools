#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const enquirer_1 = require("enquirer");
const recursive_copy_1 = __importDefault(require("recursive-copy"));
const child_process_1 = require("child_process");
const CHOICES = (fs.readdirSync(path.join(__dirname, "..", 'templates')));
const QUESTIONS = [
    {
        name: 'name',
        type: "input",
        message: 'What is your plugin called?'
    },
    {
        name: 'template',
        type: 'select',
        message: 'Which language are you using?',
        choices: CHOICES
    }
];
console.log("🐸 Welcome to the \x1b[4m\x1b[42m\x1b[30m Croakerr \x1b[0m plugin generator");
console.log("🐸 This generator will walk you through setting up your Croakerr plugin");
console.log("🐸 First thing's first, ");
(0, enquirer_1.prompt)(QUESTIONS)
    .then((answers) => __awaiter(void 0, void 0, void 0, function* () {
    const CURR_DIR = process.cwd();
    const options = {
        projectName: answers['name'],
        templateName: answers['template'],
        templatePath: path.join(__dirname, "..", 'templates', answers['template']),
        targetPath: path.join(CURR_DIR, answers['name'])
    };
    if (!(yield createProjectDirectory(options.targetPath)))
        return;
    if (!(yield generateProjectFiles(options)))
        return;
    if (!(yield installDependencies(options)))
        return;
    console.log("🐸 \x1b[32mPlugin generated successfully\x1b[0m");
    console.log("🐸 To get started with your new plugin, navigate to");
    console.log("🐸\x1b[3m", options.targetPath);
    console.log("\x1b[0m");
    console.log("🐸 To compile your plugin, run");
    console.log("🐸 \x1b[34m$\x1b[3m npm run build\x1b[0m");
}))
    .catch(e => {
    console.log(e);
});
function createProjectDirectory(project) {
    try {
        console.log("🐸 \x1b[34m[INFO]\x1b[0m Making project directory");
        console.log("🐸 \x1b[34m[INFO]\x1b[0m " + project);
        fs.mkdirSync(project, { recursive: true });
        return true;
    }
    catch (e) {
        process.stdout.write("🐸 \x1b[31m");
        console.error(e);
        process.stdout.write("\x1b[0m");
        return false;
    }
}
function generateProjectFiles(options) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🐸 \x1b[34m[INFO]\x1b[0m Generating project files");
        try {
            yield (0, recursive_copy_1.default)(options.templatePath, options.targetPath);
            let pkg = JSON.parse(fs.readFileSync(options.targetPath + "/package.json", 'utf-8'));
            let plugin = JSON.parse(fs.readFileSync(options.targetPath + "/croakerr-manifest.json", 'utf-8'));
            pkg.name = options.projectName.toLowerCase();
            plugin.name = options.projectName;
            fs.writeFileSync(options.targetPath + "/package.json", JSON.stringify(pkg));
            fs.writeFileSync(options.targetPath + "/croakerr-manifest.json", JSON.stringify(plugin));
            return true;
        }
        catch (e) {
            process.stdout.write("🐸 \x1b[31m");
            console.error(e);
            process.stdout.write("\x1b[0m");
            return false;
        }
    });
}
function installDependencies(options) {
    try {
        process.chdir(options.targetPath);
        console.log("🐸 Installing core dependencies");
        (0, child_process_1.exec)("npm install");
        return true;
    }
    catch (e) {
        process.stdout.write("🐸 \x1b[31m");
        console.error(e);
        process.stdout.write("\x1b[0m");
        return false;
    }
}
