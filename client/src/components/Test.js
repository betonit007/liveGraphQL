import { useEffect } from 'react'
import { useQuery, useSubscription, gql } from '@apollo/client';

const GET_USERS = gql`
query {
    allUsers {
      _id
      username
      email
      images {
        url
      }
      about
    }
  }
`;

const ALL_POSTS = gql`
query {
  allPosts {
    content
  }
}
`

const LISTEN_POSTS = gql`
  subscription {
    postMade {
      content
    }
  }
`

const Test = () => {

  const { loading, error, data } = useQuery(GET_USERS);
  const { subscribeToMore, loading: postsLoad, error: postsErr, data: allPosts } = useQuery(ALL_POSTS);
  console.log(allPosts)
  //const { loading: subLoading, error: subErr, data: subData } = useSubscription(LISTEN_POSTS);


  //https://www.apollographql.com/docs/react/data/subscriptions/
  useEffect(() => {
    subscribeToMore({
      document: LISTEN_POSTS,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newPost = subscriptionData.data.postMade
        const newObj = Object.assign({}, prev, {
          allPosts: [newPost, ...prev.allPosts]
        })
        return newObj
      }
    })
  }, [])

  return (
    <div>
      <div className="users">
        {loading ? <h1>Loading...</h1>
          :
          data.allUsers.map(user => (
            <div key={user._id}>
              <h1>{user.username}</h1>
              <h4>{user.email}</h4>
            </div>
          ))}
      </div>

      <div className="allposts">
        {postsLoad ? <h1>Loading Posts.....</h1>
          :
          <div>
            {allPosts.allPosts?.map((post, i) => (
              <div key={i} className="singlePost">
                {post.content}
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}

export default Test
