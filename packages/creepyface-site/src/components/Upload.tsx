import React from 'react'
import Link from './Link'
import Button from './Button'
import { useTranslate } from './Language'
import { useSelector, useDispatch } from './State'
import { upload, showPermissions } from '../redux/actions'
import Modal from './Modal'
import { Namespace } from '../redux/types'

export default function Upload({ namespace }: { namespace: Namespace }) {
  const downloadLink = useSelector((state) => state.downloadLink)
  const viewLink = useSelector((state) => state.viewLink)
  const uploading = useSelector((state) => state.uploading)
  const { download, research, samples, show } = useSelector(
    (state) => state.permissions
  )
  const dispatch = useDispatch()
  const translate = useTranslate()

  return (
    <div className="upload">
      <div>
        <Button
          icon="download"
          className="download"
          href={downloadLink}
          loading={uploading}
          download={!!downloadLink}
          action={!downloadLink ? upload(namespace) : undefined}
        >
          {translate(
            downloadLink
              ? 'Download again'
              : samples
              ? 'Download and publish'
              : 'Download'
          )}
        </Button>
        {viewLink && (
          <Button
            icon="twitter"
            href={`http://twitter.com/share?text=${translate(
              'See my creepyface!'
            )}&url=${viewLink}&hashtags=creepyface_io`}
          >
            {translate('Share on Twitter')}
          </Button>
        )}
      </div>
      {!downloadLink && (
        <small>
          {translate('By downloading your creepyface you accept')}{' '}
          <Button type="link" action={showPermissions}>
            {translate('these conditions')}
          </Button>
          .
          <Modal
            id="permissions"
            isOpen={show}
            title={'Permissions'}
            onClose={() => dispatch(showPermissions())}
          >
            <p>
              {translate(
                'We will store your images for the following purposes'
              )}
              :
            </p>
            <fieldset>
              <label>
                <input
                  disabled
                  type="checkbox"
                  checked={download}
                  onChange={() =>
                    dispatch({ type: 'toggleDownloadPermission' })
                  }
                />
                <strong>{translate('Generate the download link')}</strong>
                <p>
                  <small>
                    {translate(
                      'They will be permanently deleted at any time without further notice'
                    )}
                    .
                  </small>
                </p>
              </label>
              <label>
                <input
                  type="checkbox"
                  autoFocus
                  checked={research}
                  onChange={() =>
                    dispatch({ type: 'toggleResearchPermission' })
                  }
                />
                <strong>{translate('Use them for research')}</strong>
                <p>
                  <small>
                    {translate(
                      'We want to train an AI that can generate a creepyface based on just 1 image. For this to happen we need as many images as possible so please tick this box if you find it interesting'
                    )}
                    .
                  </small>
                </p>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={samples}
                  onChange={() => dispatch({ type: 'toggleSamplesPermission' })}
                />
                <strong>
                  {translate('Publish them as samples in the front page')}
                </strong>
                <p>
                  <small>
                    {translate(
                      'The images will be stored and publicly served as reduced size thumbnails. They may be permanently deleted at any time without further notice'
                    )}
                    .
                  </small>
                </p>
              </label>
            </fieldset>
            <p>
              <small>
                {translate(
                  'If at any time you change your mind and want your images to be permanently deleted please send us an email to'
                )}{' '}
                <Link href="mailto:privacy@creepyface.io">
                  privacy@creepyface.io
                </Link>
                .
              </small>
            </p>
            <Button icon="accept" action={showPermissions}>
              {translate('Accept')}
            </Button>
          </Modal>
        </small>
      )}
    </div>
  )
}
