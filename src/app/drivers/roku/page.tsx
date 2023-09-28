'use server'

import {XMLParser} from "fast-xml-parser";

export async function getDeviceInfo(ip, port) {
    const parser = new XMLParser()

    // const res = await fetch('https://api.example.com/...')
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    try {
        console.log('ip: ', ip, ', port: ', port);
        const res = await fetch(`http://${ip}:${port}/query/device-info`, {
            cache: 'no-store',
        })
            // .then(response => response.json())
            .then(response => response.text())
            .then(response => parser.parse(response))
            .then(data => {
                return data
            });
        // console.log('res: ', res);
        // if (res?.status !== 200) {
        //     // This will activate the closest `error.js` Error Boundary
        //     console.log('Failed to fetch data')
        // }

        return res
    } catch (e) {
        console.log('error: ', e);
        console.log('caught error, returning false');
        return false
    }
}

export async function powerOn(ip, port) {
    const parser = new XMLParser()

    const res = await fetch(`http://${ip}:${port}/keypress/PowerOn`, {
        method: 'POST',
        cache: 'no-store',
    })
        .then(response => response.text())
        .then(response => parser.parse(response))
        .then(data => {
            return data
        });
    console.log('res: ', res);

    return res
}

export async function powerOff(ip, port) {
    const parser = new XMLParser()

    const res = await fetch(`http://${ip}:${port}/keypress/PowerOff`, {
        method: 'POST',
        cache: 'no-store',
    })
        .then(response => response.text())
        .then(response => parser.parse(response))
        .then(data => {
            return data
        });
    console.log('res: ', res);

    return res
}

export async function tvChannels(ip, port) {
    const parser = new XMLParser()

    try {
        const res = await fetch(`http://${ip}:${port}/query/tv-channels`, {
            cache: 'no-store',
        })
            .then(response => response.text())
            .then(response => parser.parse(response))
            .then(data => {
                return data
            });
        console.log('res: ', res);

        return res
    } catch (e) {
        console.log('error: ', e);
        return false
    }
}

export async function tvActiveChannel(ip, port) {
    const parser = new XMLParser()

    const res = await fetch(`http://${ip}:${port}/query/tv-active-channel`, {
        cache: 'no-store',
    })
        .then(response => response.text())
        .then(response => parser.parse(response))
        .then(data => {
            return data
        });
    console.log('res: ', res);

    return res
}

export async function keypress(ip, port, key) {
    const parser = new XMLParser()

    const res = await fetch(`http://${ip}:${port}/keypress/${key}`, {
        method: 'POST',
        cache: 'no-store',
    })
        .then(response => response.text())
        .then(response => parser.parse(response, ))
        .then(data => {
            return data
        });
    console.log('res: ', res);

    return res
}

export async function query(ip:String, port:Number, key:String) {
    const parser = new XMLParser({
        ignoreAttributes: false,
    })

    const res = await fetch(`http://${ip}:${port}/query/${key}`, {
        cache: 'no-store',
    })
        .then(response => response.text())
        .then(response => parser.parse(response))
        .then(response => {
            const {'?xml': _, ...rest} = response;
            return rest;
        })
    console.log('res: ', res);

    return res
}

export async function launch(ip:String, port:Number, app:String) {
    const parser = new XMLParser()

    const res = await fetch(`http://${ip}:${port}/launch/${app}`, {
        method: 'POST',
        cache: 'no-store',
    })
        .then(response => response.text())
        .then(response => parser.parse(response))
        .then(data => {
            return data
        });
    console.log('res: ', res);

    return res
}

// export default async function Page() {
//     const data = await getData('10.0.0.162', '8060');
//     console.log(data);
//
//     return <main></main>
// }