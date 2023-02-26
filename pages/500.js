export default function Custom500({ text = 'Default Error Text' }) {
  return (
    <div style={{ background: 'tomato', height: '100vh', width: '100%' }}>
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
