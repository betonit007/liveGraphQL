import { useEffect, useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client';
import { useHistory } from 'react-router-dom'

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

const ADD_POST = gql`
mutation postCreate($input: PostCreateInput!){
  postCreate(input:$input){
    content
  }
}
`

const Test = () => {

  //CRUD Apollo
  const { subscribeToMore, loading: postsLoad, error: postsErr, data: allPosts } = useQuery(ALL_POSTS);
  const [createPost] = useMutation(ADD_POST);

  //const { loading: subLoading, error: subErr, data: subData } = useSubscription(LISTEN_POSTS);

  //post state
  const [post, setPost] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    createPost({variables: {input: {content: post}}})
    setPost("")
  }

  //https://www.apollographql.com/docs/react/data/subscriptions/
  useEffect(() => {
    subscribeToMore({
      document: LISTEN_POSTS,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newPost = subscriptionData.data.postMade
        const newObj = Object.assign({}, prev, {
          allPosts: [...prev.allPosts, newPost]
        })
        return newObj
      }
    })
  }, [])

  let history = useHistory()

  const authToken = localStorage.getItem('AUTH_TOKEN')

  useEffect(() => {
    if (!authToken) history.push('/login')
  }, [authToken])

  return (
    <div>
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
      <div className="enterPost">
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter a message to post..." 
            value={post}
            onChange={e=>setPost(e.target.value)}
            />
          <input type='submit' value="Submit" />
        </form>
      </div>
    </div>
  )
}

export default Test
