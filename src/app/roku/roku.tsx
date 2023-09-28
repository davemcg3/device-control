'use client'

import {useEffect, useState} from "react";
import {getDeviceInfo, powerOff, powerOn, tvChannels, tvActiveChannel, keypress} from "@/app/api/driver/roku/page";
import {json} from "stream/consumers";

function Roku() {
    const [rokuIP, setRokuIP] = useState("");
    const [rokuPort, setRokuPort] = useState(0);
    const [deviceInfo, setDeviceInfo] = useState({});
    const [allTvChannels, setAllTvChannels] = useState({});
    const [selectedTvActiveChannel, setSelectedTvActiveChannel] = useState({});

    const pollDeviceInfo = () => {
        console.log('polling device info');
        getDeviceInfo(rokuIP, rokuPort).then((data) => {
            console.log('get device info result: ', data);
            if (data !== false) {
                setDeviceInfo(data);
                setTimeout(pollDeviceInfo, 5000);
            }
        })
        .catch((error) => {
            console.log('error: ', error);
        })
    }

    useEffect(() => {
        pollDeviceInfo();
    }, [rokuIP, rokuPort]);

    const handleChange = (event) => {
        event.preventDefault();
        switch (event.target.name) {
            case "rokuIP":
                setRokuIP(event.target.value);
                break;
            case "rokuPort":
                setRokuPort(event.target.value);
                break;
            default:
                break;
        }
    }

    const renderKeypress = (key, value) => {
        return(
            <div key={key}>
                <button onClick={() => {
                    keypress(rokuIP, rokuPort, key).then((data) => {
                        console.log('keypress result: ', data);
                    });
                }}>{value}</button>
                <br />
            </div>
        )
    }

    const inputSwitchingKeys = {
        InputTuner: `Switch to Tuner`,
        InputHDMI1: "Switch to HDMI1}",
        InputHDMI2: "Switch to HDMI2}",
        InputHDMI3: "Switch to HDMI3}",
        // "InputHDMI4", // my TV doesn't have this
        InputAV1: "Switch to AV1}",
    }

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

    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <form>
                    Roku IP<br/>
                    <input name="rokuIP" type="text" onChange={handleChange} value={rokuIP}/><br/>
                    Roku port<br/>
                    <input name="rokuPort" type="number" onChange={handleChange} value={rokuPort}/><br/>
                </form>
                {/*<pre>ip: {rokuIP}</pre>*/}
                {/*<pre>port: {rokuPort}</pre>*/}
                <div>
                    <button onClick={() => {
                        getDeviceInfo(rokuIP, rokuPort).then((data) => {
                            console.log('get device info result: ', data);
                            setDeviceInfo(data);
                        });
                    }}>Get Device Info
                    </button>
                    <pre>Power: {deviceInfo?.["device-info"]?.["power-mode"]}</pre>
                    {deviceInfo?.["device-info"]?.["power-mode"] !== "PowerOn" ?
                        <button onClick={() => {
                            powerOn(rokuIP, rokuPort).then((data) => {
                                console.log('power on result: ', data);
                                // setDeviceInfo(data);
                            })
                                .then(() => {
                                    getDeviceInfo(rokuIP, rokuPort).then((data) => {
                                        // console.log('get device info result: ', data);
                                        setDeviceInfo(data);
                                    });

                                })
                        }}>Turn On</button>
                        : <button onClick={() => {
                            powerOff(rokuIP, rokuPort).then((data) => {
                                console.log('power off result: ', data);
                                // setDeviceInfo(data);
                            })
                                .then(() => {
                                    getDeviceInfo(rokuIP, rokuPort).then((data) => {
                                        // console.log('get device info result: ', data);
                                        setDeviceInfo(data);
                                    })
                                });
                        }}>Turn Off</button>}
                    {/*<pre>Uptime: {deviceInfo?.["device-info"]?.["uptime"]}</pre>*/}
                    {/*<pre>{JSON.stringify(deviceInfo, null, 2)}</pre>*/}
                    <br />
                    <button onClick={() => {
                        tvChannels(rokuIP, rokuPort).then((data) => {
                            console.log('tv channels result: ', data);
                            setAllTvChannels(data);
                        });
                    }}>Get TV Channels</button>
                    <pre>{JSON.stringify(allTvChannels)}</pre>
                    <br />
                    <button onClick={() => {
                        tvActiveChannel(rokuIP, rokuPort).then((data) => {
                            console.log('tv active channel result: ', data);
                            setSelectedTvActiveChannel(data);
                        });
                    }}>Get TV Active Channel</button>
                    <pre>{JSON.stringify(selectedTvActiveChannel)}</pre>
                    <br />
                    {Object.entries(inputSwitchingKeys).map(([key, value]) => {
                        return renderKeypress(key, value);
                    })}
                    <br />
                    {Object.entries(volumeKeys).map(([key, value]) => {
                        return renderKeypress(key, value);
                    })}
                    <br />
                    {Object.entries(channelKeys).map(([key, value]) => {
                        return renderKeypress(key, value);
                    })}
                    <br />
                    {Object.entries(otherSupportedKeys).map(([key, value]) => {
                        return renderKeypress(key, value);
                    })}
                </div>
            </div>
        </div>
    )
}

export default Roku;