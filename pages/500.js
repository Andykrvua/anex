export default function Custom500({ text = 'Default Error Text' }) {
  return (
    <div style={{ background: 'var(--bg)', height: '300px', width: '100%' }}>
      <div className="container">
        <span>{text}</span>
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      text: 'Error',
    },
  };
}
