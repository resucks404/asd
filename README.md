# Instagram FLMT CLI

This repository contains a legacy command-line tool in `FMLT.zip`, not a web app.
It signs in to Instagram and attempts to follow accounts that liked a media post,
then comments on and likes their latest posts. **Running it can change your account
and publish comments.** Only use it where you have permission and comply with
Instagram's rules.

## Start

Install Node.js and npm, then extract the archive before running npm commands:

```sh
unzip FMLT.zip -d FMLT
cd FMLT
npm install
npm start
```

The interactive prompts ask for your username, masked password, media link,
comment text (separate alternatives with `|`), and delay between batches.
Delay is in **milliseconds**: `1000` means one second. Enter a whole number
between `1` and `2147483647`; invalid values keep you at the prompt so you can
correct them.

This uses a legacy unofficial Instagram API. Reaching the prompts does not
confirm that login or Instagram actions still work. No live account is needed
for the local regression checks below.

## Local checks

With Node.js 18+ and `unzip` installed, run from the repository root:

```sh
node --test tests/cli.test.cjs
```

These checks read the shipped archive, verify its startup configuration, and
exercise delay validation without network requests or account credentials.
