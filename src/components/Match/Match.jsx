import React from 'react'

const Match = (props) => {
    console.log( props)
  return (
    <div>
        <p>{props.match.name}</p>
    </div>
  )
}

export default Match