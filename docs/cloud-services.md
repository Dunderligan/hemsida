# Cloud services

## Battlenet

## Cloudflare

Cloudflare is used in two ways:

- File storage via [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/). This is used for storing team logos and the landing page hero/trailer video. Any S3-compatible storage can technically be used, but R2 is preferred due to its (very) generous free tier and easy integration with Images.
- Image serving and optimization via [Cloudflare Images](https://www.cloudflare.com/developer-platform/products/cloudflare-images/).

To set these up for yourself, [create a Cloudflare account](https://dash.cloudflare.com/login) and navigate to the [Dashboard](https://dash.cloudflare.com).

Cloudflare may ask you for a credit card on sign up. However, your usage will fall well below the free tier threshold.

### R2 Object Storage

[Create a new R2 bucket](https://dash.cloudflare.com/9c3c36808f7b9a5adadff441d7f2ddcd/r2/overview). The project is by default configured to use a bucket named "dunderligan", however you can pick any name as long as it's reflected in the environment file. Leave `Location` as is, and pick the the `Standard` storage class.

Navigate to the `Settings` tab, find `Public Development URL` and click `Enable`. Copy the url into the `PUBLIC_CDN_ENDPOINT` field of the `.env` file.

Go back to the main R2 page, find `API Tokens` on the right sidebar and click `Manage`.

Create a new API token. For permissions, pick `Object Read & Write`. The rest of the options are up to preference.

Cloudflare will now show the `Access Key ID`, `Secret Access Key` and S3 endpoint for the newly created API token. Copy the three values into their respective fields of the `.env` file. **These will not be shown again!**

R2 should now be working. However, team logos still won't display until you've setup Images as well. Nevertheless, you can still test it out by uploading a team logo via the admin page and check that it was added to the R2 bucket.

### Images
