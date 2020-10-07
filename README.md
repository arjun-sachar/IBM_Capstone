# DashBlocks 2

## Vue + Loopback starter pack used to create dashboards

## For video tutorials, and other tips and tricks please download the Dashblocks 2 wiki! https://github.ibm.com/codeblue/dashblocks-2-wiki

## Contributers

- Daniel Barbarito
- Jeremy Chase
- Darshan Mohan

### Tech Stack

- Vue
- Loopback
- Ant Design
- Node
- ChartJS
- LESS

### Setup

1. Run `npm install`

_If you were using Node version 6 for dash-blocks(1), you may need to update it to continue. Install nvm, restart terminal, and use latest node version. `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash`,close and reopen terminal, then `nvm install node`. If you need to go back to dash-blocks(1), you can`nvm use 6` or `nvm use 11` to switch between them._

2. Run `npm run dev` to run the development environment
3. Access the dashboard via `http://localhost:8080`

### Deploying

DashBlocks 2 ships with a deploy script, which is located at `scripts/deploy`. It is a Perl script that requires some dependencies before running. To install these dependencies, run `scripts/scripts_setup.sh`.

The deploy script accepts one parameter; the environment you wish to deploy to. By default, the following environments are accepted: `dev`, `test`, `uat`, and `prod`.

Example:

Running `scripts/deploy dev` will set your `manifest.yml` file to contain the following:

```yaml
applications:
  - path: .
    memory: 256MB
    instances: 1
    disk_quota: 1024M
    domain: mybluemix.net
    name: dashblocksV2-dev
    host: dashblocksV2-dev
    command: npm start
```

As you can see, it sets the URL it will be deployed to and the memory it contains based off of the environment that was passed in. After updating the manifest file, it will then run `cf push` for you.

---

### Project Structure / Key Files

- ui-config holds configuration for certain properties that control the UI. These include where the navbar lives, if the global filters appear, and if users should have an API key associated with them.

#### Data Service / External API Calls

Location: `client/src/services/DataService.js`

- Data Service / External API calls

#### Styling

All styling files are contained in the assets folder (**client/src/assets/**). **\_shell.less** and **\_layout.less** are the stylesheets that are used for most of the default layout of the application. This includes pieces such as: navbar, main application container, the header, and the filters. **\_forms.less**, **\_flex.less**, **\_charts.less**, and **\_buttons.less** are stylesheets that were created to make the application styling look better. These files include helpers such as the ability to create dynamically sized boxes (flex) and style plotly (charts). **custom.less** is where project specific classes should be created.

**\_theme.less** has the default values that effect the entire application. This includes default primary color, secondary color, default text color, and margin for tiles (tiles explained below).

##### Important Classes to know:

**.tile**: a tile that will appear on your dashboard. tiles usually contain graphs, tables, or other data (see chartWizard or styling default pages for examples). Tile has subclasses to make the styling consistent and help with the layout. Subclasses include shadow (if tile has shadow), the position (top, left, right, bottom, middle) to ensure consistent spacing, and if it has a header in it.
**.tile-content**: this is the container for the data within the tile. This is important as it will create the correct height depending on if a titlebar exists in the tile or not.
**.flex-[]**: these styles are used to set heights. the nubmer afer the flex defines what percentage of the height the container should take up allowing for reactivity and flexbility when creating grid layouts.

- Pages (Views)
- Components
- Services

### Admin

- Roles / Permissions
- Users
- Activities
- Feedback

### Default Pages

....

### ChartJS

The default charting library is ChartJS and we are using a npm package to enable ChartJS in VueJS. Each chart in takes the following parameters: datasets, layout, labels, type and options. For more information on each of these, please go to chartjs.org.

- Datasets: Datasets is an array of arrays, with each subarray containing the Y axis data for your charts. Each subarray is a dataset that would be used to build a bar or a line on your charts.
- Layout: Layout is an array of objects, with each subobject containing styling information for the corresponding dataset. This would allow users to style individual lines by adding color, width, or other styling.
- Labels: Labels is an array of the X axis tick marks or pie slices.
- Options: This is an object that contains specific information for the charts to further style them such as the hole size in a pie chart.
- Type: The type of chart that should be displayed, options include: bar, stacked (stacked bar), line, radar, bubble, and pie (donut or pie chart).

All charts will use the ChartJS component and that will use the type tag to load the correct graph.

....

### Local Database

The dev database is stored in localhost:3000/explorer and you can put your API key found under the admin tab via API Explorer. You can then scroll down and click "try it out" under tabs such as /users to get all the users available.

### Temporary Passwords

Users have a temp_pass boolean associated with them. If this is true, they must immediately reset their password. Users can have this property changed by the Admin, which he can do underneath the Users tab, via Add, Edit, or Update Password. Generate Random Password fills out the password field for you and automatically checks the temp_pass switch.

### filters

Global filters can be set up in the GlobalFilters.vue file. All global filters should be set in here. If you want to disable global filters, there is a parameter in App.vue where this can be turned on and off. All global filters take an object with the following parameters: label (display name), name (internal name), and type (filter type), `data` (function for getting data), params (params for get data function). These objects can be passed in an array and generated by calling the addFilters function from filterservice. Example exists in the GlobalFilters.vue file.

There are 5 filter types: 1) single or default (normal dropdown), 2) multiple (multi-select), 3) date (date picker), 4) week (week picker), 5) month (month picker)
For the date related ones filters, `data` should be set to null and a new key/value pair should be added. The key should be date and the value should be a dictionary with the values minDate and maxDate. These parameters are optional and are used to disable certain dates. Users can put just a min, just a max, both, or none.

### Bonus Commands

To automatically reformat your code in the client folder use the command `npm run prettify`
