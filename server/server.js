import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY,
});

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeX!'
    })
})

app.post('/', async (req, res) => {
    try{
        const messages = req.body.messages;

        const ChatCompletion = await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages: messages,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: ChatCompletion.choices[0].message
        });

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error(error.status);  // e.g. 401
            console.error(error.message); // e.g. The authentication token you passed was invalid...
            console.error(error.code);  // e.g. 'invalid_api_key'
            console.error(error.type);  // e.g. 'invalid_request_error'
          } else {
            // Non-API error
            console.log(error);
          }
    }

})

app.listen(5000, () => console.log('Server is running on http://localhost:5000'));

