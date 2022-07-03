#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { prompt } from 'enquirer';
import copy from 'recursive-copy';
import { exec } from "child_process";


interface CliOptions {
    projectName: string
    templateName: string
    templatePath: string
    targetPath: string
}

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

console.log();
console.log("🐸 Welcome to the \x1b[4m\x1b[42m\x1b[30m Croakerr \x1b[0m plugin generator")
console.log("🐸 This generator will walk you through setting up your Croakerr plugin");
console.log("🐸 First thing's first, ")

prompt(QUESTIONS)
    .then(async (answers: any) => {
        const CURR_DIR = process.cwd();
        const options: CliOptions = {
            projectName: answers['name'],
            templateName: answers['template'],
            templatePath: path.join(__dirname, "..", 'templates', answers['template']),
            targetPath: path.join(CURR_DIR, answers['name'])
        }

        if (!await createProjectDirectory(options.targetPath)) return;
        if (!await generateProjectFiles(options)) return;
        if (!await installDependencies(options)) return;

        console.log("🐸 \x1b[32mPlugin generated successfully\x1b[0m");
        console.log("🐸 To get started with your new plugin, navigate to")
        console.log("🐸\x1b[3m", options.targetPath);
        console.log("\x1b[0m");
        console.log("🐸 To compile your plugin, run");
        console.log("🐸 \x1b[34m$\x1b[3m npm run build\x1b[0m");
    })
    .catch(e => {
        console.log(e);
    });


function createProjectDirectory(project: string): boolean {
    try {
        console.log("🐸 \x1b[34m[INFO]\x1b[0m Making project directory")
        console.log("🐸 \x1b[34m[INFO]\x1b[0m " + project)
        fs.mkdirSync(project, { recursive: true })
        return true;
    } catch (e) {
        process.stdout.write("🐸 \x1b[31m")
        console.error(e);
        process.stdout.write("\x1b[0m")
        return false
    }
}

async function generateProjectFiles(options: CliOptions): Promise<boolean> {
    console.log("🐸 \x1b[34m[INFO]\x1b[0m Generating project files")
    try {
        await copy(options.templatePath, options.targetPath);

        let pkg = JSON.parse(fs.readFileSync(options.targetPath + "/package.json", 'utf-8'));
        let plugin = JSON.parse(fs.readFileSync(options.targetPath + "/croakerr-manifest.json", 'utf-8'));

        pkg.name = options.projectName.toLowerCase();
        plugin.name = options.projectName;

        fs.writeFileSync(options.targetPath + "/package.json", JSON.stringify(pkg));
        fs.writeFileSync(options.targetPath + "/croakerr-manifest.json", JSON.stringify(plugin));


        return true;
    } catch (e) {
        process.stdout.write("🐸 \x1b[31m")
        console.error(e);
        process.stdout.write("\x1b[0m")
        return false;
    }
}


function installDependencies(options: CliOptions): boolean {
    try {
        process.chdir(options.targetPath);

        console.log("🐸 Installing core dependencies")

        exec("npm install")

        return true;
    } catch (e) {
        process.stdout.write("🐸 \x1b[31m")
        console.error(e);
        process.stdout.write("\x1b[0m")
        return false;
    }
}