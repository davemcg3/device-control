'use client'

import {useEffect, useRef, useState} from "react";
import {getDeviceInfo} from "@/app/drivers/sony/page";

function Sony() {
    const [sonyIP, setSonyIP] = useState(localStorage.getItem('sonyIP') || "");
    const [sonyPort, setSonyPort] = useState(parseInt(localStorage.getItem('sonyPort')) || 0);
    const [deviceInfo, setDeviceInfo] = useState({});
    const [ipAndPortFormVisible, setIpAndPortFormVisible] = useState(true);
    const [timeoutId, setTimeoutId] = useState([]);
    const timeoutRef = useRef(timeoutId);

    useEffect(() => {
        timeoutRef.current = timeoutId;
    }, [timeoutId]);

    const pollDeviceInfo = () => {
        setTimeoutId(timeoutId.slice(1));
        try {
            getDeviceInfo(sonyIP, sonyPort).then((data) => {
                if (data !== false) {
                    setDeviceInfo(data);
                    if (timeoutRef.current.length === 0) {
                        setTimeoutId([...timeoutRef.current, setTimeout(pollDeviceInfo, 5000)]);
                    }
                }
            })
        } catch (error) {
            console.log('error: ', error);
        }
    }

    useEffect(() => {
        if (sonyIP !== "" && sonyPort !== 0) {
            pollDeviceInfo();
            setIpAndPortFormVisible(false);
        }
        // callQuery(sonyIP, sonyPort, 'apps');
    }, [sonyIP, sonyPort]);

    const handleChange = (event: Event ) => {
        event.preventDefault();
        switch (event?.target?.name) {
            case "sonyIP":
                localStorage.setItem('sonyIP', event.target.value);
                break;
            case "sonyPort":
                setSonyPort(event.target.value);
                localStorage.setItem('sonyPort', event.target.value);
                break;
            default:
                break;
        }
    }

    return (
        <div className="flex flex-col items-center justify-between p-1">
            <div>
                <h1>Sony</h1>
                <form style={{display: ipAndPortFormVisible ? 'block' : 'none'}}>
                    Sony IP<br/>
                    <input name="sonyIP" type="text" onChange={handleChange} value={sonyIP}/><br/>
                    Sony port<br/>
                    <input name="sonyPort" type="number" onChange={handleChange} value={sonyPort}/><br/>
                </form>
                <pre><button onClick={() => {
                    setIpAndPortFormVisible(!ipAndPortFormVisible);
                }}>{ipAndPortFormVisible ? 'Hide Settings' : 'Show Settings'}</button></pre>
                <pre>Polling: {timeoutId.length === 0 ? 'inactive' : 'active'} {timeoutId.length === 0 ? (<button onClick={
                    pollDeviceInfo
                }>Start polling</button>) : ''}</pre>
            </div>
        </div>
    )
}

export default Sony;