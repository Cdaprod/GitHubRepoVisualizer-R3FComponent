import React from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { Html } from '@react-three/drei';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer YOUR_GITHUB_ACCESS_TOKEN_HERE`,
  },
  cache: new InMemoryCache(),
});

const GET_REPOS = gql`
  query {
    viewer {
      repositories(first: 10) {
        nodes {
          name
          description
          stargazerCount
          forkCount
          url
        }
      }
    }
  }
`;

const InteractiveModel: React.FC = () => {
  const { loading, error, data } = useQuery(GET_REPOS, { client });
  const [isClicked, setIsClicked] = useState(false);
  const modelRef = useRef<any>(null);

  const handleClick = () => {
    setIsClicked(true);
  };

  const glowColor = 'blue';

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      {data.viewer.repositories.nodes.map((repo: any) => (
        <mesh key={repo.name} ref={modelRef} onClick={handleClick}>
          <boxBufferGeometry attach="geometry" />
          <meshStandardMaterial attach="material" color={glowColor} />
          {isClicked && (
            <Html position={[0, 1, 0]}>
              <div style={{ color: 'white' }}>
                <p>Name: {repo.name}</p>
                <p>Stars: {repo.stargazerCount}</p>
                <p>Forks: {repo.forkCount}</p>
                <p><a href={repo.url} target="_blank" rel="noreferrer">Go to Repository</a></p>
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </>
  );
};

const GitHubRepoVisualizer: React.FC = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <InteractiveModel />
    </Canvas>
  );
};

export default GitHubRepoVisualizer;
