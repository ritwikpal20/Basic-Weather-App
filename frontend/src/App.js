import { useState, useEffect, useRef } from "react";
import CitySearch from "./components/CitySearch";
import WeatherCard from "./components/WeatherCard";

const bStyle = {
    color: "white",
};

function App() {
    const [data, setData] = useState({});
    var updated = useRef(false);
    useEffect(() => {
        if (!updated.current) {
            if (window.localStorage.getItem('ritwik-weather-app')){
                setData(JSON.parse(window.localStorage.getItem('ritwik-weather-app')));
            }
            updated.current = true;
        }        
    }, [data]);

    return (
        <div className="App">
            <CitySearch data={data} setData={setData} />
            {data.city ? (
                <WeatherCard data={data} />
            ) : (
                <center>
                    <b style={bStyle}>No weather details retreived</b>
                </center>
            )}
        </div>
    );
}

export default App;
