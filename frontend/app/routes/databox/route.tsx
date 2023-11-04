import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useParams } from "@remix-run/react";
import { css } from "styled-system/css";
import { BlueButton } from "~/components/atoms/Button/blueButton";
import { AuthorizedHeader } from "~/components/organisms/AuthorizedHeader";
import { routes } from "~/constants/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFileUpload } from "@fortawesome/free-solid-svg-icons";

export const meta: MetaFunction = () => {
  return [
    { title: "DataBox" },
    { name: "description", content: "DataBoxメイン" },
  ];
};

export default function Index() {
  const params = useParams();

  return (
    <>
      <AuthorizedHeader />
      <main
        className={css({
          width: "95%",
          margin: "2rem auto",
          fontSize: "10px",
          md: {
            fontSize: "12px",
          },
          lg: {
            fontSize: "16px",
          },
        })}
      >
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            columnGap: "1rem",
          })}
        >
          <Link to={routes.CREATE_DIR(params.directoryId)}>
            <BlueButton
              className={css({
                display: "flex",
                alignItems: "center",
                columnGap: ".5rem",
              })}
              designType="outline"
            >
              <FontAwesomeIcon icon={faFolder} />
              ディレクトリ作成
            </BlueButton>
          </Link>
          <Link to={routes.UPDATE_FILE(params.directoryId)}>
            <BlueButton
              className={css({
                display: "flex",
                alignItems: "center",
                columnGap: ".5rem",
              })}
              designType="outline"
            >
              <FontAwesomeIcon icon={faFileUpload} />
              ファイルアップロード
            </BlueButton>
          </Link>
        </div>
        <Outlet />
      </main>
    </>
  );
}
