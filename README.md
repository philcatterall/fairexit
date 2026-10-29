# A Fair Exit

Campaign proof of concept about changes to Business Asset Disposal Relief, initiated by Phil after 28 years building a business.

Live Azure POC: https://white-plant-043aaf503.4.azurestaticapps.net/

## Site

The buildless site lives in `dist/`. It contains the campaign story, draft demands, sourced BADR timeline, a rate comparison calculator, an editable MP letter and a demonstration supporter form. The form does not submit or save personal data. No analytics or mailing list is configured.

The headline illustrates £80,000 additional tax from the 10% to 18% rate rise, plus £30,000 from the announced lifetime-limit reduction: £110,000 combined on a £1 million qualifying gain. Assumptions are displayed alongside it, including no prior BADR use and a 24% rate above the reduced limit. Allowances, losses and other reliefs are excluded. Founder relief and its interaction with BADR still require review. The interactive calculator compares the 10% and 18% rates only.

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
- Region: `westeurope`
- Custom domain: not configured

Prerequisites: Azure CLI signed in to the intended subscription, Node.js/npm, and permission to manage the resource group and Static Web App.

```powershell
.\scripts\Deploy-FairExit.ps1 -SubscriptionId '<your-subscription-id>'
```

The script creates or updates the Free hosting resource, stages `dist/` into ignored `.azure-output/`, and publishes using Microsoft's Static Web Apps CLI. It keeps the deployment token in the process environment and restores any previous value afterwards. Tokens are not written to source or passed as command arguments. Existing custom domains and access settings are not configured by this script.

Deployments are manual. Pushing this repository does not automatically deploy to Azure.

## Before a full campaign launch

Agree the campaign name and demands, review the full policy terms and founder relief interaction, and implement real supporter registration with appropriate consent and privacy information. The current Azure page is publicly accessible and explicitly labelled a proof of concept.
