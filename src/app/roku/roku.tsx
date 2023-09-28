'use client'

import {useEffect, useRef, useState} from "react";
import {
    getDeviceInfo,
    powerOff,
    powerOn,
    tvChannels,
    tvActiveChannel,
    keypress,
    query,
    launch
} from "@/app/drivers/roku/page";
import {json} from "stream/consumers";
import Image from "next/image";

function Roku() {
    const [rokuIP, setRokuIP] = useState(localStorage.getItem('rokuIP') || "");
    const [rokuPort, setRokuPort] = useState(parseInt(localStorage.getItem('rokuPort')) || 0);
    const [deviceInfo, setDeviceInfo] = useState({});
    const [allTvChannels, setAllTvChannels] = useState({});
    const [selectedTvActiveChannel, setSelectedTvActiveChannel] = useState({});
    const [apps, setApps] = useState([]);
    const [ipAndPortFormVisible, setIpAndPortFormVisible] = useState(true);

    const [timeoutId, setTimeoutId] = useState([]);
    const timeoutRef = useRef(timeoutId);
    useEffect(() => {
        timeoutRef.current = timeoutId;
    }, [timeoutId]);

    const pollDeviceInfo = () => {
        setTimeoutId(timeoutId.slice(1));
        try {
            getDeviceInfo(rokuIP, rokuPort).then((data) => {
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
        if (rokuIP !== "" && rokuPort !== 0) {
            pollDeviceInfo();
            setIpAndPortFormVisible(false);
        }
        callQuery(rokuIP, rokuPort, 'apps');
    }, [rokuIP, rokuPort]);

    const handleChange = (event) => {
        event.preventDefault();
        switch (event.target.name) {
            case "rokuIP":
                setRokuIP(event.target.value);
                localStorage.setItem('rokuIP', event.target.value);
                break;
            case "rokuPort":
                setRokuPort(event.target.value);
                localStorage.setItem('rokuPort', event.target.value);
                break;
            default:
                break;
        }
    }

    const renderKeypress = (key, value) => {
        const action = () => keypress(rokuIP, rokuPort, key).then((data) => {
            console.log('keypress result: ', data);
        });
        let button;
        switch(key){
            case "VolumeUp":
                button = <button onClick={action}>
                    <Image className="filter-white" src="/volumeUp.svg" alt="Volume Up Button" width={50} height={50} />
                </button>
                break;
            case "VolumeDown":
                button = <button onClick={action}>
                    <Image className="filter-white" src="/volumeDown.svg" alt="Volume Down Button" width={50} height={50} />
                </button>
                break;
            case "VolumeMute":
                button = <button onClick={action}>
                    <Image className="filter-white" src="/volumeMute.svg" alt="Volume Mute Button" width={50} height={50} />
                </button>
                break;
            case "ChannelUp":
                button = <button onClick={action}>
                    <Image className="filter-white" src="/channelUp.svg" alt="Channel Up Button" width={50} height={50} />
                </button>
                break;
            case "ChannelDown":
                button = <button onClick={action}>
                    <Image className="filter-white" src="/channelDown.svg" alt="Channel Down Button" width={50} height={50} />
                </button>
                break;
            default:
                button =
                <button onClick={action}>{value}</button>
                break;
        }
        return(
            <div key={key}>
                {button}
            </div>
        )
    }

    const callQuery = (rokuIp, rokuPort, key) => query(rokuIP, rokuPort, key).then((data) => {
        console.log('query result: ', data);
        // TODO: Make sure this works with all queries.
        switch(key){
            case "apps":
                setApps(data.apps.app);
                break;
        }
    });
    const renderQuery = (key:String, value:String) => {
        return(
            <div key={key}>
                <button onClick={() => {
                    callQuery(rokuIp, rokuPort, key);
                }}>{value}</button>
                <br />
            </div>
        )
    }

    const renderLaunch = (id:Number, text:String, type:String, version:String) => {
        return(
            <div key={`launch-${id}`}>
                <button onClick={() => {
                    launch(rokuIP, rokuPort, id).then((data) => {
                        console.log('query result: ', data);
                    });
                }}>{text}, type: {type}, version: {version}</button>
                <br />
            </div>
        )
    }

    // const inputSwitchingKeys = {
    //     InputTuner: `Switch to Tuner`,
    //     InputHDMI1: "Switch to HDMI1}",
    //     InputHDMI2: "Switch to HDMI2}",
    //     InputHDMI3: "Switch to HDMI3}",
    //     // "InputHDMI4", // my TV doesn't have this
    //     InputAV1: "Switch to AV1}",
    // }
    //
    const volumeKeys = {
        VolumeUp: "Volume Up",
        VolumeDown: "Volume Down",
        VolumeMute: "Volume Mute",
    }

    const channelKeys = {
        ChannelUp: "Channel Up",
        ChannelDown: "Channel Down",
    }

    const otherSupportedKeys = {
        Home: "Home",
        Rev: "Rev",
        Fwd: "Fwd",
        Play: "Play",
        Select: "Select",
        Left: "Left",
        Right: "Right",
        Down: "Down",
        Up: "Up",
        Back: "Back",
        InstantReplay: "Instant Replay",
        Info: "Info",
        Backspace: "Backspace",
        Search: "Search",
        Enter: "Enter",
    }

    // const queryKeys = {
    //     "media-player": "Media Player",
    //     "apps": "Apps",
    // }

    return (
        <div className="flex flex-col items-center justify-between p-1">
            <div>
                <form style={{display: ipAndPortFormVisible ? 'block' : 'none'}}>
                    Roku IP<br/>
                    <input name="rokuIP" type="text" onChange={handleChange} value={rokuIP}/><br/>
                    Roku port<br/>
                    <input name="rokuPort" type="number" onChange={handleChange} value={rokuPort}/><br/>
                </form>
                <pre><button onClick={() => {
                    setIpAndPortFormVisible(!ipAndPortFormVisible);
                }}>{ipAndPortFormVisible ? 'Hide Settings' : 'Show Settings'}</button></pre>
                {/*<pre>ip: {rokuIP}</pre>*/}
                {/*<pre>port: {rokuPort}</pre>*/}
                <pre>Polling: {timeoutId.length === 0 ? 'inactive' : 'active'} {timeoutId.length === 0 ? (<button onClick={
                    pollDeviceInfo
                }>Start polling</button>) : '' }</pre>
                {/*<pre>timeout: {timeoutId}</pre>*/}
                <div>
                    {/*<button onClick={() => {*/}
                    {/*    getDeviceInfo(rokuIP, rokuPort).then((data) => {*/}
                    {/*        console.log('get device info result: ', data);*/}
                    {/*        setDeviceInfo(data);*/}
                    {/*    });*/}
                    {/*}}>Get Device Info*/}
                    {/*</button>*/}
                    <div aria-roledescription="device controls">
                        <a onClick={() => {
                            deviceInfo?.["device-info"]?.["power-mode"] !== "PowerOn" ?
                                powerOn(rokuIP, rokuPort).then((data) => {
                                    console.log('power on result: ', data);
                                    // setDeviceInfo(data);
                                }) : powerOff(rokuIP, rokuPort).then((data) => {
                                    console.log('power off result: ', data);
                                    // setDeviceInfo(data);
                                });
                        }}>
                            <Image className={deviceInfo?.["device-info"]?.["power-mode"] !== "PowerOn" ? 'filter-on' : 'filter-off'} src="/power.svg" alt={deviceInfo?.["device-info"]?.["power-mode"] !== "PowerOn" ? "Power On Button" : "Power Off Button"} width={50} height={50} />
                        </a>
                        {/*<pre>Power: {deviceInfo?.["device-info"]?.["power-mode"]}</pre>*/}
                        {/*{deviceInfo?.["device-info"]?.["power-mode"] !== "PowerOn" ?*/}
                        {/*    <button onClick={() => {*/}
                        {/*        powerOn(rokuIP, rokuPort).then((data) => {*/}
                        {/*            console.log('power on result: ', data);*/}
                        {/*            // setDeviceInfo(data);*/}
                        {/*        })*/}
                        {/*            .then(() => {*/}
                        {/*                getDeviceInfo(rokuIP, rokuPort).then((data) => {*/}
                        {/*                    // console.log('get device info result: ', data);*/}
                        {/*                    setDeviceInfo(data);*/}
                        {/*                });*/}

                        {/*            })*/}
                        {/*    }}>Turn On</button>*/}
                        {/*    : <button onClick={() => {*/}
                        {/*        powerOff(rokuIP, rokuPort).then((data) => {*/}
                        {/*            console.log('power off result: ', data);*/}
                        {/*            // setDeviceInfo(data);*/}
                        {/*        })*/}
                        {/*            .then(() => {*/}
                        {/*                getDeviceInfo(rokuIP, rokuPort).then((data) => {*/}
                        {/*                    // console.log('get device info result: ', data);*/}
                        {/*                    setDeviceInfo(data);*/}
                        {/*                })*/}
                        {/*            });*/}
                        {/*    }}>Turn Off</button>}*/}
                        {/*<pre>Uptime: {deviceInfo?.["device-info"]?.["uptime"]}</pre>*/}
                        {/*<pre>{JSON.stringify(deviceInfo, null, 2)}</pre>*/}
                        {/*<br />*/}
                        {/*<button onClick={() => {*/}
                        {/*    tvChannels(rokuIP, rokuPort).then((data) => {*/}
                        {/*        console.log('tv channels result: ', data);*/}
                        {/*        setAllTvChannels(data);*/}
                        {/*    });*/}
                        {/*}}>Get TV Channels</button>*/}
                        {/*<pre>{JSON.stringify(allTvChannels)}</pre>*/}
                        {/*<br />*/}
                        {/*<button onClick={() => {*/}
                        {/*    tvActiveChannel(rokuIP, rokuPort).then((data) => {*/}
                        {/*        console.log('tv active channel result: ', data);*/}
                        {/*        setSelectedTvActiveChannel(data);*/}
                        {/*    });*/}
                        {/*}}>Get TV Active Channel</button>*/}
                        {/*<pre>{JSON.stringify(selectedTvActiveChannel)}</pre>*/}
                        {/*<br />*/}
                        {/*{Object.entries(inputSwitchingKeys).map(([key, value]) => {*/}
                        {/*    return renderKeypress(key, value);*/}
                        {/*})}*/}
                        {/*<br />*/}
                        {Object.entries(volumeKeys).map(([key, value]) => {
                            return renderKeypress(key, value);
                        })}
                        <br />
                        {Object.entries(channelKeys).map(([key, value]) => {
                            return renderKeypress(key, value);
                        })}
                    </div>
                    <br />
                    {Object.entries(otherSupportedKeys).map(([key, value]) => {
                        return renderKeypress(key, value);
                    })}
                    <br />
                    {/*{Object.entries(queryKeys).map(([key, value]) => {*/}
                    {/*    return renderQuery(key, value);*/}
                    {/*})}*/}
                    {/*<br />*/}
                    {Object.values(apps).map(({ "#text": text, "@_id": id, "@_type": type, "@_version": version}) => {
                        return renderLaunch(id, text, type, version);
                    })}
                </div>
            </div>
        </div>
    )
}

export default Roku;