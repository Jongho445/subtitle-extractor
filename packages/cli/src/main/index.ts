import {hello} from "extractor";
import inquirer from "inquirer";

inquirer.prompt([
  {
    type: 'input',
    name: 'first_name',
    message: hello + " What's your first name",
  }
]);
