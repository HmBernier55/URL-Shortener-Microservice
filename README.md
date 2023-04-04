# URL Shortener Microservice

This is the code for the URL Shortener Microservice project. Instructions for building the project can be found at https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice.

## Code Explanation
The code includes two API routes:
* `/api/shorturl`
    * POST route that allows the user to input a correctly formatted URL (https://www.example.com or http://www.example.com), creates a "short URL" (random integer) to correspond to the URL, and saves the original URL and short URL to a database
    * Returns a JSON object of the following format:
    ```
    {
        original_url: <inputted URL>,
        short_url: <random int>
    }
    ```
    * If the website has already been inputted before, the code will pull that data from the database and return it in the same format as above
* `/api/shorturl/:shorturl`
    * GET route that redirects the user to the URL that corresponds to the inputted short URL
    * This is achieved by retrieving the original URL from the database using the inputted short URL as a filter parameter