const WeatherCard = (props) => {
    return (
        <>
            <div className="card mx-auto">
                <img src={props.data.imageUrl} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">
                        {props.data.city} ,
                        <span className="text-muted text-small">{props.data.country}</span>
                    </h5>
                    <p className="card-text">{props.data.weatherDescription}</p>
                    <hr />
                    <p className="card-text">
                        <b>Location:</b> {props.data.location}
                    </p>
                    <p className="card-footer">
                        <b>Temp:</b> {props.data.temp} <sup>o</sup>C
                    </p>
                </div>
            </div>
        </>
    );
};

export default WeatherCard;
