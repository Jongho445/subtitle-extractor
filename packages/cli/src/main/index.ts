import {hello} from "extractor";
import inquirer from "inquirer";

inquirer
  .prompt(["hello"])
.then(answer => {
  console.log("hello")
})
.catch()