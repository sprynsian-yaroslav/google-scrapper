import React from 'react';
import PropTypes from "prop-types";

const image = 'https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673.png';

export default function Placeholder({ text = "NO DATA" }) {
    return (
        <section className="table-placeholder">
            <span className="table-placeholder__title">{text}</span>
            <img src={image} alt="" className="table-placeholder__image" height="50" width="50" />
        </section>
    );
}

Placeholder.propTypes = {
    text: PropTypes.string,
}