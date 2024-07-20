import React from 'react';
import MetaTags from 'react-meta-tags';
import PropTypes from 'prop-types'

export default function PageMeta({ title }) {
    return (
        <MetaTags>
            <title>{title}</title>
        </MetaTags>
    );
}

PageMeta.propTypes = {
  title: PropTypes.string,
}