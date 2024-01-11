'use server'

const psk:string="bowstring1025";
export async function getDeviceInfo(ip:string, port=80) {
    // const res = await fetch('https://api.example.com/...')
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    try {
        console.log('ip: ', ip, ', port: ', port);
        const res = await fetch(`http://${ip}:${port}/sony/system`, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-PSK': psk,
            },
            body: JSON.stringify({
                "method": "getSystemInformation",
                "id": 33,
                "params": [],
                "version": "1.0"
            })
        })
            .then(response => response.json())
            .then(data => {
                return data
            });
        console.log('res: ', res);
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

