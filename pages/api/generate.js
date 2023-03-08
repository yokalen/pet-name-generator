import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function(req, res){
    if(!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured."
            }
        });
        return;
    }

    const animal = req.body.animal || '';
    if (animal.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid animal.",
            }
        });
        return;
    }
    // send the request to the OpenAI API
    try{
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(animal),
            temperature: 0.6,
        });
        res.status(200).json({ result: completion.data.choices[0].text });
    } catch (error) {
        if(error.response){
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        }else{
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                }
            });
        }
    }
}
// generates the prompt for OpenAI API
function generatePrompt(animal){
    const capitalizedAnimal = 
        animal[0].toUpperCase() + animal.slice(1).toLowerCase();
        return `Suggest three names for an animal that belongs to a superhero.

    Animal: Cat
    Names: Sharpclaw, Mr. Whiskers, Valerie
    Animal: Dog
    Names: Bruno, Wonder Canine, Sir Barks-a-Lot
    Animal: ${capitalizedAnimal}
    Names:`;
}