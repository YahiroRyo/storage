import {
  faCog,
  faFile,
  faFolder,
  faQuestion,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import type { FileObject } from "api/@types";
import { useState, type DragEvent } from "react";
import { css } from "styled-system/css";
import { routes } from "~/constants/routes";

type Props = {
  file: FileObject;
};

export const File = ({ file }: Props) => {
  if (file.mimetype.indexOf("image") !== -1) {
    return (
      <FileWrapper
        to={routes.PREVIEW_IMAGE(file.id, file.directory_id)}
        file={file}
      >
        <FontAwesomeIcon icon={faFile} />
      </FileWrapper>
    );
  }
  if (file.mimetype.indexOf("video") !== -1) {
    return (
      <FileWrapper
        to={routes.PREVIEW_VIDEO(file.id, file.directory_id)}
        file={file}
      >
        <FontAwesomeIcon icon={faVideo} />
      </FileWrapper>
    );
  }
  if (file.mimetype === "DIR") {
    return (
      <FileWrapper to={routes.DATABOX(file.id)} file={file}>
        <FontAwesomeIcon icon={faFolder} />
      </FileWrapper>
    );
  }

  return (
    <FileWrapper to={file.url} file={file}>
      <FontAwesomeIcon icon={faQuestion} />
    </FileWrapper>
  );
};

const FileWrapper = ({
  file,
  to,
  children,
}: Props & { to: string; children: React.ReactNode }) => {
  const [rootStyle, setRootStyle] = useState({});
  const [dragOverStyle, setDragOverStyle] = useState({});

  const dragStartHandler = (e: DragEvent<HTMLAnchorElement>) => {
    e.dataTransfer.setData("text/plain", file.id);
  };
  const dragEndHandler = (e: DragEvent<HTMLAnchorElement>) => {
    setRootStyle({ display: "none" });
  };
  const dragOverHandler = (e: DragEvent<HTMLAnchorElement>) => {
    setDragOverStyle({ backgroundColor: "rgba(51, 51, 51, .3)" });
  };
  const dragLeaveHandler = () => {
    setDragOverStyle({});
  };

  return (
    <div
      className={css({
        position: "relative",
      })}
      style={rootStyle}
    >
      <Link
        className={css({
          position: "absolute",
          right: ".25rem",
          top: ".25rem",
          color: "gray",
          fontSize: "1.5rem",
          padding: ".5rem",
          borderRadius: "8px",
          transition: ".1s",
          _hover: {
            backgroundColor: "darkWhite",
          },
        })}
        to={routes.SETTING_FILE(file.id, file.directory_id)}
      >
        <FontAwesomeIcon icon={faCog} />
      </Link>
      <Link
        className={css({
          display: "block",
          borderRadius: "8px",
          border: "1px solid var(--colors-white-gray)",
          padding: "1rem",
          backgroundColor: "white",
          transition: ".1s",
          _hover: {
            backgroundColor: "rgba(200, 200, 200, .3)",
          },
        })}
        to={to}
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragLeaveHandler}
        style={dragOverStyle}
        draggable
      >
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            marginBottom: "1rem",
            color: "gray",
            fontSize: "3rem",
          })}
        >
          {children}
        </div>
        <div
          className={css({
            backgroundColor: "gray",
            height: "1px",
            width: "100%",
          })}
        />
        <p
          className={css({
            marginTop: "1rem",
            color: "gray",
          })}
        >
          {file.name}
        </p>
      </Link>
    </div>
  );
};
