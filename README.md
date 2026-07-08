# SparkPair - Next.js Application

This is a modern web application built with Next.js, TypeScript, and reusable components.

---

## Project Structure

The project uses the Next.js app router with shared UI components under `components/` and server-side helpers under `lib/`.

---

## MongoDB Atlas Local Development

SparkPair uses `MONGODB_URI` for the GarmentsOS PRO control center. The app supports both Atlas URI styles:

```env
MONGODB_URI=mongodb+srv://...
```

or the direct multi-host Atlas URI:

```env
MONGODB_URI=mongodb://host1.mongodb.net:27017,host2.mongodb.net:27017,host3.mongodb.net:27017/sparkpair?ssl=true&replicaSet=REPLICA_SET_NAME&authSource=admin&retryWrites=true&w=majority
```

On Windows local dev, `mongodb+srv://` requires DNS SRV lookup. If local requests fail with:

```text
querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net
```

use the direct `mongodb://` multi-host Atlas URI instead.

To derive the direct URI values:

```powershell
nslookup -type=SRV _mongodb._tcp.<cluster>.mongodb.net
nslookup -type=TXT <cluster>.mongodb.net
```

Use the SRV result hosts as `host1,host2,host3` with port `27017`. Use the TXT result to find the `replicaSet` value when Atlas provides it.

Also check:

- Atlas Network Access includes your current IP address.
- Port `27017` is not blocked by your network/firewall.
- `.env.local` contains `MONGODB_URI` and `MONGODB_DB=sparkpair`.
- Restart `npm run dev` after changing `.env.local`.

Never commit real MongoDB passwords or production secrets.

---

## GarmentsOS PRO License Activation

GarmentsOS PRO does not require users to type a license key inside the local app.

The local app should:

- Generate or reuse a local `install_id`.
- Send `install_id`, `machine_hash`, `machine_name`, and `app_version` to `/api/licenses/register-install`.
- Keep working offline with its cached active license/grace state when the server is unreachable.
- Call `/api/licenses/verify` with `product`, `install_id`, `machine_hash`, and `app_version`.

SparkPair admin should:

- Review pending devices in `/admin/license-devices`.
- Review demo/trial and paid activation requests in `/admin/activation-requests`.
- Approve and link the device to a customer/license.
- Block suspicious devices when needed.

Existing clients should update first, then auto-register through the install registration API.

Fresh installs can also submit a customer-assisted activation request to `/api/licenses/request-demo` with business contact details, `install_id`, `machine_hash`, `machine_name`, and `app_version`. Admin approval creates or links the customer, license, and approved device from one screen.

---

## Cloudinary Product Media

SparkPair product/project media is uploaded to Cloudinary from admin-only routes. MongoDB stores only Cloudinary metadata such as `public_id`, `secure_url`, dimensions, format, alt text, captions, and sort order.

Required environment variables:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=sparkpair/products
CLOUDINARY_MAX_IMAGE_MB=5
CLOUDINARY_MAX_VIDEO_MB=50
```

Cloudinary secrets must stay server-side. Product uploads use `/api/admin/uploads/cloudinary` and are stored under `sparkpair/products/<product-slug>/`.
