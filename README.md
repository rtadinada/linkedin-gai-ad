# AI Auto-Generate Campaign Chrome Extension

This is a Chrome extension that allows you to use GPT-3 and Dall-E to auto-generate ads
on LinkedIn based on a landing page. This extension was originally built for a LinkedIn
hackathon.

One of the things limiting demand for advertising is the "cold-start problem", especially for
smaller businesses that do not have the resources for a marketing team.
The idea behind the project is to make creating a campaign dead-easy by allowing campaign
creation with just a link to a landing page. Given the link, the extension will pull the
contents of the site and use them as inputs to Open AI queries for ad copy and images.
Then the advertiser is presented with 5 options for the headline, intro text, and image.
They can select the combination they want, select multiple ads, and tweak the copy according 
o their needs. After that, the campaign is automatically created for them and they're taken
to the campaign's creatives page.

## Installing 

To install the Chrome extension, do the following:

1. Run `npm run build`
2. Go to the Chrome extensions page (type in "chrome://extensions/")
3. Click the toggle for **Developer mode** in the top right
4. Click **Load unpacked** in the top left and select the `dist/` folder
5. In the extensions submenu (should be to the right of the address bar), on the **LinkedIn AI Ad Creator** extension, open the dot menu and select **Options**
6. (**Important**) Specify a LinkedIn _Campaign Group Id_ belonging to the account you are creating the campaign in (a hack because the extension doesn't have API access)
7. Enter an OpenAI Key
8, If you want, edit the prompts
9, Navigate to the **Advertiser** tab in an account in LinkedIn's **Campaign Manager** (e.g. https://www.linkedin.com/campaignmanager/accounts/<advertiser-id>/campaign-groups), and you should see an **Auto-Generate** button with a green beaker

## Usage

Just hit the **Auto-Generate** button and enter a landing page, and follow the instructions in the modal!
You can edit ad copy by clicking on the text.

<p align="center">
  <img width="1100" alt="Screenshot 2023-02-08 at 2 55 27 PM" src="https://github.com/rtadinada/linkedin-gai-ad/assets/2136938/962e869a-ec90-4871-81f1-1f36feb75922">
</p>

<p align="center">
  <img width="600" alt="Screenshot 2023-02-08 at 2 58 12 PM" src="https://github.com/rtadinada/linkedin-gai-ad/assets/2136938/69b4c5ba-a2c6-4394-b192-d5b27db67795">
</p>

<p align="center">
  <img width="600" alt="image2023-2-8_15-2-4" src="https://github.com/rtadinada/linkedin-gai-ad/assets/2136938/af255f8b-bafe-4b10-a77f-bfb3ac323081">
</p>


