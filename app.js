const prompt = require('prompt-sync')();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config()
const Poem = require('./poem.js')

const closeApp = async () => {
    try {
        await mongoose.disconnect(); // Close the MongoDB connection
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
    process.exit(); // Exit the script
};

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the script with a non-zero exit code to indicate failure
    }
};

connect().then(async () => {
    // const username = prompt('What is your name?');
    // console.log(`Hi ${username}! Welcome to Ember, a 20th Century Campfire Simulation. Here you can relax and write a poem or two if you're feeling up for it.`);

    console.log("Menu:");
    console.log("1. Write Poem");
    console.log("2. View Past Poems");
    console.log("3. Update a Poem");
    console.log("4. Delete a Poem");
    console.log("5. Quit");

    const writePoem = async () => {
        const poemString = prompt('Please write your poem!');
        console.log('your poem:', poemString);
        const author = prompt('Amazing! Who wrote this beautiful poem?')
        const createPoem = async () => {

            const poemData = {
            poem: poemString,
            author: author,
            };
            
            try {
                const poem = await Poem.create(poemData);
                console.log("Your Poem:", poem);
            } catch (error) {
                console.error("Error creating poem:", error);
            }
        };
        await createPoem();
    }

    const findAllPoems = async () => {
        const poems = await Poem.find({});
        console.log('past poems:', poems)
    }

    let choice;
    // the do method I got from chatGPT. Also, when I worked with Malik on the paired programming landscape game, we learned about the switch method, so I used that one here. 
    do  {
    
        choice = prompt('Enter your choice (1-5): ');

        switch(choice) {
            case '1':
                console.log("You chose to write a poem.");
                await writePoem();
                
                break;
            case '2':
                console.log("You chose to view past poems.");
                await findAllPoems();
                
                break;
            case '3':
                console.log("You chose to update a poem.");
                await findAllPoems();
                const id = prompt('Which poem do you want to update? Please paste the poem id: ');
                const poem = await Poem.findById(id);
                const newPoem = prompt('Update the poem: ')
                poem.poem = newPoem
                await poem.save();
                console.log('Your poem has been successfully updated.')
                
                
                break;
            case '4':
                await findAllPoems();
                const deleteId = prompt('Which poem do you want to delete? ');
                const deletePoem = await Poem.findByIdAndDelete(deleteId);
                
                console.log("You deleted the poem.");
                
                break;
            case '5':
                console.log("You chose to quit. Goodbye!");
                await closeApp();
                break;
            default:
                console.log("Invalid choice. Please enter a number between 1 and 5.");
        }
    } while(choice !== '5');
})


