# ![](https://raw.githubusercontent.com/hoobs-org/HOOBS/master/docs/logo.png)

Library for interacting with network interfaces on Debian based systems.

## Prerequisites
This library is designed for Debian systems, and requires a few packages to be installed.

```
sudo apt install wpasupplicant network-manager dnsmasq hostapd
```

Next you need to disable the *dnsmasq* and *hostapd* services. These services will be dynamically configured and controled by this library.

```
sudo systemctl disable dnsmasq
sudo systemctl disable hostapd
```

## Installing
HOOBS recommends Yarn. From your project's root run;

```sh
yarn add @hoobs/network
```

Or using NPM.

```sh
npm install @hoobs/network
```

## Usage
First inport this into your code.

```js
const network = require("./network");
```

Fetch a list of active connections.

```js
const connections = network.current();

if (network.connected) {
    console.log(connections);
}
```

Fetch a list of network devices.

```js
const devices = network.devices();
```

Fetch a list of available wireless networks.

```js
const networks = network.wireless.scan();
```

Connect/Disconnect a wireless network.

```js
network.wireless.connect("ssid", "password");
network.wireless.disconnect();
```

Forget a network.

```js
network.wireless.forget("ssid");
```

Up/Down a wired connection.

```js
network.ethernet.up("eth0");
network.ethernet.down("eth0");
```

## Legal
HOOBS and the HOOBS logo are registered trademarks of HOOBS Inc. Copyright (C) 2020 HOOBS Inc. All rights reserved.
