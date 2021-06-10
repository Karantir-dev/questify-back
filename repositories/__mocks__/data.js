const cards = [
  {
    id: '60b8ccb1aa37e91d78b92b44',
    difficulty: 'normal',
    isChallenge: false,
    text: 'Test First Card',
    category: 'family',
    isCompleted: false,
    deadline: '2021-06-03T12:52:04.679Z',
  },
  {
    id: '60b8d774fc2d4b562040e7b4',
    difficulty: 'hard',
    isChallenge: true,
    text: 'Test Second Card',
    category: 'learning',
    isCompleted: true,
    deadline: '2021-09-27T06:38:44.679Z',
  },
]

const newCard = {
  text: 'Test new card',
  category: 'work',
  deadline: '1632724724679',
  isChallenge: false,
  isCompleted: false,
}

const User = {
  _id: '60b7e8133cf037001c9496fe',
  name: 'Dmytro',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjdlODEzM2NmMDM3MDAxYzk0OTZmZSIsImlhdCI6MTYyMjgwMDgzNSwiZXhwIjoxNjIyODIyNDM1fQ.XQLpXTVjjnQW2nkVgs70gB1hbb97aoZVvnKJqx4X8xc',
  verify: true,
  verifyTokenEmail: null,
  email: 'shalenyi.dm@gmail.com',
  password: '$2a$06$aVHx6GMZmFKufS/f5oOQQus0rUoqCnPVz7/TzYt4cBHccKTk7bPF6',
  createdAt: '2021-06-02T20:20:35.754+00:00',
  updatedAt: '2021-06-04T10:00:35.646+00:00',
}

const users = []
users[0] = User

const newUser = { email: 'dmytro@shalenyi.com', password: 'examplepassword' }

module.exports = {
  cards,
  newCard,
  User,
  users,
  newUser,
}
