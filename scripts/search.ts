// searchTweets.ts

import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

// Use the COOKIE_FUN_API_KEY from the environment or fallback to a placeholder
const API_KEY = process.env.COOKIE_FUN_API_KEY || "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.cookie.fun/v1";

/**
 * Fetch tweets matching a search query within a given date range.
 * @param searchQuery - The word or phrase to search for in tweet text.
 * @param from - Start date for the search (YYYY-MM-DD format).
 * @param to - End date for the search (YYYY-MM-DD format).
 * @returns Parsed JSON response containing the top 20 tweets.
 */
async function searchTweets(searchQuery: string, from: string, to: string): Promise<any> {
    const endpoint = `${BASE_URL}/hackathon/search/${encodeURIComponent(searchQuery)}?from=${from}&to=${to}`;

    try {
        const response = await fetch(endpoint, {
            headers: { "x-api-key": API_KEY }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Fetch failed: ${error}`);
    }
}

/**
 * Main function to run the tweet search.
 */
async function main() {
    const searchQuery = "trump"; // Replace with your desired search term
    const fromDate = "2023-10-01"; // Replace with your desired start date
    const toDate = "2023-10-15"; // Replace with your desired end date

    console.log(`Searching tweets for query "${searchQuery}" from ${fromDate} to ${toDate}...`);

    try {
        const tweets = await searchTweets(searchQuery, fromDate, toDate);
        console.log("Tweets Found:\n", JSON.stringify(tweets, null, 2));
    } catch (error) {
        console.error("Error fetching tweets:", error);
    }
}

main();
