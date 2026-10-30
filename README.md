# A Fair Exit

A campaign about changes to Business Asset Disposal Relief, initiated by Phil after 28 years building a business.

Public site: https://www.fairexit.org/

The POC runs on Azure Static Web Apps. Deployment-specific subscription identifiers and the personal hosting endpoint are kept out of this public README.

## Site

The buildless site lives in `dist/`. The campaign uses a navy, white and cobalt visual identity with a direct relief-limit comparison graphic, the “Enough is enough” opening, sourced tax comparisons, Phil’s story and the proposed Founders’ Relief thresholds. Visitors can personalise and copy or download an MP letter, prepare a Treasury consultation response and share the site. No messages are sent by the website.

Supporter registration and a backend are deliberately deferred. The old demonstration signup form has been removed. No personal data, analytics or mailing list is collected by the site code. Fonts are self-hosted and their licences are included in `dist/fonts/`.

The headline illustrates £80,000 additional tax from the 10% to 18% rate rise, plus £30,000 from the announced lifetime-limit reduction: £110,000 combined on a £1 million qualifying gain. Assumptions are displayed alongside it, including no prior BADR use and a 24% rate above the reduced limit. Allowances, losses and other reliefs are excluded. The proposed Founders’ Relief criteria are explained and linked to the consultation. The interactive calculator compares earlier rules (10%, £1m cap), current rules (18%, £1m cap) and the announced rules (18% up to £500k, 24% above).

## Local preview

From the repository root:

```powershell
python -m http.server 4173 --directory dist
```

Open http://localhost:4173/.

## Azure deployment

The POC is deployed to Azure Static Web Apps on the Free plan:

- Resource group: `rg-fair-exit`
- Static Web App: `swa-fair-exit`
- Subscription: select the intended subscription explicitly when deploying
- Region: choose a Static Web Apps region available to that subscription
- Custom domains: `fairexit.org` and `www.fairexit.org`, with Azure-managed HTTPS

Prerequisites: Azure CLI signed in to the intended subscription, Node.js/npm, and permission to manage the resource group and Static Web App.

```powershell
.\scripts\Deploy-FairExit.ps1 -SubscriptionId '<your-subscription-id>' -Location '<supported-region>'
```

The script registers the Microsoft.Web provider when required, reuses an existing resource group or creates one, creates or updates the Free hosting resource, stages all of `dist/` (including fonts and images) into ignored `.azure-output/`, and publishes using Microsoft's Static Web Apps CLI. It keeps the deployment token in the process environment and restores any previous value afterwards. Tokens are not written to source or passed as command arguments. Existing custom domains and access settings are not configured by this script.

Existing deployments are retained when deploying to another subscription. Custom domains must be configured separately on the selected app.

Deployments are manual. Pushing this repository does not automatically deploy to Azure.

## Before a full campaign launch

Agree the next iteration of the campaign demands. Before enabling supporter registration, establish the campaign contact and privacy details, explicit consent choices and an appropriate backend. The source checks are dated 30 October 2026; review the consultation actions after 30 November 2026.

## Alternate openings for review

The default is “Enough is enough”. Add `?direction=finish-line` for “Stop moving the finish line”, or `?direction=small-business` for “Small business. Big betrayal.” These are optional creative-review links; there is no extra theme selector in the public visitor flow.

## Verification

Check the rendered desktop and phone layouts, primary action links, MP and consultation dialogs, copy/download controls, and the calculator around £500,000 and £1 million. Keep the illustrative assumptions visible alongside the figures. No fake supporters or endorsements are displayed.


## ONS turnover comparison

The founders-relief section uses the 2026 ONS UK business workbook, Table 15, UK row 6, Company (including Building Society) category. B6:I6 sum to 2,113,885 enterprises below £10m; J6:K6 sum to 41,515 at least £10m; L6 totals 2,155,400. The calculated below-threshold share is 98.073907%, displayed as 98.1%. Scope and methodological qualifications are beside the statistic on the page. This is not a count of Companies House registrations or a forecast of future relief eligibility.
