// bcrypt is for hashing the password
import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@store-front.com',
        password: bcrypt.hashSync('12345678', 10),
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@store-front.com',
        password: bcrypt.hashSync('12345678', 10),
    },
    {
        name: 'Jane Doe',
        email: 'jane@store-front.com',
        password: bcrypt.hashSync('12345678', 10),
    }
]

export default users