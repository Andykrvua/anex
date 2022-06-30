export default function Custom500({ text = 'Default Error Text' }) {
  return (
    <div style={{ background: 'red', height: '100vh', width: '100vw' }}>
      <span>{text}</span>
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      text: 'Static Error Text',
    },
  };
}
