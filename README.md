# GrocerEase Front End Service

[!GrocerEase](./public/img/background.jpg)

Welcome to GrocerEase! Home for your groceries needs, whether you're a seller or a buyer. We provide store management services but also store lookup services based on proximity and price for buyers. 

## Dependencies

This project depends on:
- npm to manage node packages
- Next.js, react, and Tailwind for styling Front Ends
- Typescript since the project is written using typescript
- Vercel for deployment
- Git for version controlling

## Deploy Your Own GrocerEase Service

To deploy your own instance of GrocerEase, start by installing all the dependencies:

```bash
npm run dev
```

and clone our public repository (using HTTPS):

```bash
git clone https://github.com/fabian4819/GrocerEase-FE.git
```

(or SSH):

```bash
git clone git@github.com:fabian4819/GrocerEase-FE.git
```
Deploy using Vercel or IaaS if you're into it ;)

## Folder Structure

To customize your GrocerEase instance, you can start from the folder structure to see how the project is managed.

.env \
index.ts \
public \
├── image \
src \
├── app \
├── configs \
├── utils \
tsconfig.json
tailwindconfig.json

Context:
- `app` is the folder where all the pages index pages are, and where the site's main index page is. It also has `layout.tsx` and `global.css` for global styling configuration.
- `public` is the folder created by Next to store public assets like logo and background pictures.
- `configs` is the folder for additional configuration.
- `utils` is the folder for utilization, in this case is used to simplify API calling logic. 

All the files in this project are written in typescript and will be compiled when built using Vercel. 

## Enpoints

| URL                                    | Purpose                                 |
|----------------------------------------|-----------------------------------------|
|grocer-ease-fe.vercel.app/              | Landing page                            |
|grocer-ease-fe.vercel.app/login         | Login page                              |
|grocer-ease-fe.vercel.app/register      | Register page                           |
|grocer-ease-fe.vercel.app/dashboard     | Dashboard page, you can choose to manage store or products here |
|grocer-ease-fe.vercel.app/storeList     | Page to list all available stores       |
|grocer-ease-fe.vercel.app/storeDetail/[storeId]     | Page to list specific store |
|grocer-ease-fe.vercel.app/productList   | Page to list all available products. You can sort from price or proximity |
|grocer-ease-fe.vercel.app/editProfile   | Edit user profile                          |

## Credits

Made by:
- 22/496484/TK/54400 Bagas Pujangkoro
- 22/505501/TK/55319 Habib Fabian Fahlesi
- 22/492727/TK/53940 Rama Sulaiman Nurcahyo
- 22/496725/TK/54440 Wulan Tiarahayu
- 22/496507/TK/54405 Fidelya Fredelina

## Aditional Links
- Presentation (Video): https://youtu.be/7zoDM_9DnuY
- Presentation (File) : https://docs.google.com/presentation/d/14Zl_DLHmumO0FdT4bG2qJpS0hMucqYjWjXPvdmiIUy8/edit?usp=sharing
- UI/UX design: https://www.figma.com/design/3uGeXl32DVmENm3WX3rTwc/GrocerEase?node-id=0-1&t=UY9tSAwFXKMO3aOP-1
- Backend Repo: https://github.com/fabian4819/GrocerEase-BE
- Deployed at: https://grocer-ease-fe.vercel.app/
