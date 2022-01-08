import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        // Token expire after 1 week
        expiresIn: '7d'
    })
}

export default generateToken