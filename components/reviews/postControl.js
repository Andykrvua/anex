import styles from './postControl.module.css';
import { useState, useRef } from 'react';
import { useSetWindowInfo } from '/store/store';
import { infoModal } from '/utils/constants';
import { useIntl } from 'react-intl';
import { reviewsAtacchmentFolderId, reviewsHandlerPath } from 'utils/constants';

const UploadFile = ({ selectedFile, setSelectedFile, loading }) => {
  const setModalInfo = useSetWindowInfo();
  const intl = useIntl();
  const filePicker = useRef(null);

  const addFile = (e) => {
    if (e.target.files.length > 6 || selectedFile.length === 6) {
      const data = {
        show: true,
        type: infoModal.warning,
        text: intl.formatMessage({ id: 'reviews.form.files.count' }),
      };
      setModalInfo(data);
      e.target.value = null;
      return;
    }

    if (e.target.files[0].size > 6000000) {
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'reviews.form.files.size' }),
      };
      setModalInfo(data);
      e.target.value = null;
      return;
    }
    const arr = [];
    [...new Array(e.target.files.length)].map((_, ind) => {
      const modify = e.target.files[ind].lastModified;
      const size = e.target.files[ind].size;
      let test;
      selectedFile.map((file) => {
        if (file.lastModified === modify) {
          if (file.size === size) test = true;
        }
      });
      if (test) {
        const data = {
          show: true,
          type: infoModal.warning,
          text: intl.formatMessage({ id: 'reviews.form.files.doubles' }),
        };
        setModalInfo(data);
      } else {
        arr.push(e.target.files[ind]);
      }
    });

    setSelectedFile((prev) => [...prev, ...arr]);
    e.target.value = null;
  };

  const removeFile = (indImage) => {
    if (loading) return;
    const arr = [];
    selectedFile.map((item, ind) =>
      ind !== indImage ? arr.push(item) : URL.revokeObjectURL(item)
    );
    setSelectedFile([...arr]);
  };

  return (
    <>
      <input
        ref={filePicker}
        className="visuallyhidden"
        type="file"
        onChange={addFile}
        accept="image/png, image/jpeg, image/webp"
        multiple
        tabIndex={-1}
      />
      {selectedFile[0] && (
        <div className={styles.imagespreview_wrapper}>
          {selectedFile.map((file, ind) => {
            return (
              <div key={ind} className={styles.image_wrapper}>
                <img
                  className={styles.img}
                  src={URL.createObjectURL(file)}
                  width="200"
                  alt="attachment"
                />
                <button
                  type="button"
                  className={styles.close}
                  onClick={() => removeFile(ind)}
                >
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 42 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.657 15.343 15.343 26.657M26.657 26.657 15.343 15.343"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
      <button
        className={styles.addimage}
        type="button"
        onClick={() => filePicker.current.click()}
        disabled={loading}
      >
        <img src="/assets/img/svg/reviews/attach.svg" alt="" />
        {intl.formatMessage({ id: 'reviews.form.add-file' })}
      </button>
    </>
  );
};

export default function PostControl({ name }) {
  const setModalInfo = useSetWindowInfo();
  const intl = useIntl();

  const [selectedFile, setSelectedFile] = useState([]);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const sendHandler = async (e) => {
    e.preventDefault();

    if (review.length < 30) {
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'reviews.form.text.count' }),
      };
      setModalInfo(data);
      return;
    }

    setLoading(true);
    let atachmentRes = [];

    if (selectedFile[0]) {
      const url =
        'https://a-k.name/directus/files?access_token=49qSQ5Jp2oM5qAHWCUaZRu4iN8BLvx98yOHe7Mlem16uKWhP';
      const formData = new FormData();

      selectedFile.map((file) => {
        formData.append('folder', reviewsAtacchmentFolderId);
        formData.append('file', file);
      });

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.data instanceof Array) {
        data.data.map((item) => atachmentRes.push(item.filename_disk));
      } else {
        atachmentRes.push(data.data.filename_disk);
      }
      atachmentRes = JSON.stringify(atachmentRes);
    }

    const url = reviewsHandlerPath;
    const data = {
      name: name,
      content: review,
      img: atachmentRes,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => {
      return response.json();
    });

    if (response.ok) {
      setTimeout(() => {
        setLoading(false);
        setSelectedFile([]);
        setReview('');
        const data = {
          show: true,
          type: infoModal.ok,
          text: intl.formatMessage({ id: 'reviews.form.send.ok' }),
        };
        setModalInfo(data);
      }, 2000);
    } else {
      setTimeout(() => {
        setLoading(false);
        const data = {
          show: true,
          type: infoModal.error,
          text: intl.formatMessage({ id: 'certificates.form.send.fail' }),
        };
        setModalInfo(data);
      }, 2000);
    }
  };

  return (
    <div className={styles.form_wrapper}>
      <h2 className={styles.title}>
        {intl.formatMessage({ id: 'reviews.form.title' })}
      </h2>
      <form
        className={
          loading ? `${styles.form} ${styles.loading}` : `${styles.form}`
        }
      >
        <textarea
          cols="30"
          rows="10"
          placeholder={intl.formatMessage({
            id: 'reviews.form.textarea.placeholder',
          })}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          disabled={loading}
        ></textarea>
        <UploadFile
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          loading={loading}
        />
        <button
          className={`${styles.send_btn} apply_btn`}
          onClick={sendHandler}
          disabled={loading}
        >
          {loading
            ? intl.formatMessage({ id: 'certificates.form.btn.loading' })
            : intl.formatMessage({ id: 'contacts.form.btn' })}
        </button>
      </form>
    </div>
  );
}
