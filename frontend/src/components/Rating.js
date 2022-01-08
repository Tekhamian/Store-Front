import React from 'react'
import PropTypes from 'prop-types'

const Rating = ({value, text, color}) => {
    return (
        <div className='rating'>
            {/* 1st Star */}
            <span>
                <i style={{color}}
                    className={
                        value >= 1 
                            ? 'fas fa-star' 
                            : value >= 0.5 
                            ? 'fas fa-star-half-alt' 
                            : 'far fa-star' 
                    }>
                </i>
            </span>

            {/* 2nd Star */}
            <span>
                <i style={{color}} 
                    className={
                        value >= 2
                            ? 'fas fa-star' 
                            : value >= 1.5 
                            ? 'fas fa-star-half-alt' 
                            : 'far fa-star' 
                    }>
                </i>
            </span>

            {/* 3rd Star */}
            <span>
                <i style={{color}} 
                    className={
                        value >= 3 
                            ? 'fas fa-star' 
                            : value >= 2.5 
                            ? 'fas fa-star-half-alt' 
                            : 'far fa-star' 
                    }>
                </i>
            </span>

            {/* 4th Star */}
            <span>
                <i style={{color}}
                    className={
                        value >= 4 
                            ? 'fas fa-star' 
                            : value >= 3.5 
                            ? 'fas fa-star-half-alt' 
                            : 'far fa-star' 
                    }>
                </i>
            </span>

            {/* 5th Star */}
            <span>
                <i style={{color}}
                    className={
                        value >= 5 
                            ? 'fas fa-star' 
                            : value >= 4.5 
                            ? 'fas fa-star-half-alt' 
                            : 'far fa-star' 
                    }>
                </i>
            </span>
                <span>{text && text}</span>
        </div>
    )
}

// Setting for default color of the rating stars
Rating.defaultProps = {color: 'orange'};

Rating.propTypes = {
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string
}

export default Rating
