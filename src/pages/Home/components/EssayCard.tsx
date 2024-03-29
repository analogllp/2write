import {
  createStyles,
  Card,
  Text,
  Group,
  Stack,
  ActionIcon,
  Image,
  Menu,
  Portal,
} from "@mantine/core";
import {
  IconDots,
  IconUsers,
  IconTextSize,
  IconTrash,
  IconBrowser,
} from "@tabler/icons";
import React, { useState, useLayoutEffect, useRef } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { removeEssay } from "../../../services/FirestoreHelpers";
import html2canvas from "html2canvas";
import { UserAuth } from "../../../context/AuthContext";
import { DocumentData } from "firebase/firestore";

const useStyles = createStyles((theme) => ({
  documentCard: {
    transition: "transform 150ms ease, box-shadow 150ms ease",

    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: theme.shadows.md,
    },

    display: "flex",
    alignItems: "flex-end",
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 600,
    width: "79%",
  },
}));

export default function EssayCard(props: {
  essayId: string;
  essayTitle: string;
  essayContent: string;
  ageFilter: string;
  ownerFilter: string;
  searchParams: URLSearchParams;
  setCurrentEssayCallback: (essayId: string, oldTitle: string) => void;
  isRenameModalActive: boolean;
  setRenameModalIsOpen: Function;
  essayList: DocumentData[];
  setEssayList: Function;
}) {
  const [imgSrc, setImgSrc] = useState(
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAGIBNADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//Z"
  );
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { user } = UserAuth();
  const essayCardRef = useRef<HTMLAnchorElement>();

  // Splits the html string into an array of words, then takes the first 120 words, and joins them back into a string.
  // If the string is empty, it returns <p></p>.

  const getPreview = (html: string): string => {
    const preview = html.split(" ").slice(0, 120).join(" ");
    if (preview === "") {
      return "<p></p>";
    }
    return preview;
  };

  const getWidePreview = (html: string): string => {
    const preview = html.split(" ").slice(0, 500).join(" ");
    if (preview === "") {
      return "<p></p>";
    }
    return preview;
  };

  useLayoutEffect(() => {
    let essayHtml = props.essayContent === "" ? "<p></p>" : props.essayContent;
    let previewHtml;
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-9999px";
    if (window.innerWidth >= 2250) {
      previewHtml = getWidePreview(essayHtml);
      iframe.height = "200";
      iframe.width = "1400";
    } else {
      previewHtml = getPreview(essayHtml);
      iframe.height = "200";
      iframe.width = "620";
    }
    document.body.appendChild(iframe); // 👈 still required
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(previewHtml);
    iframe.contentWindow.document.close();
    html2canvas(iframe.contentWindow.document.body).then(function(canvas) {
      iframe.style.display = "none";
      let image = canvas.toDataURL("image/jpeg");
      setImgSrc(image);
    });
  }, [
    props.ageFilter,
    props.ownerFilter,
    props.searchParams,
    props.isRenameModalActive,
    props.essayList,
  ]);

  const handleOpenInNewTab = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(
      `/compose?${createSearchParams({ essayId: props.essayId })}`,
      "_blank"
    );
  };

  const handleRename = (event: React.MouseEvent) => {
    event.stopPropagation();
    props.setCurrentEssayCallback(props.essayId, props.essayTitle);
    props.setRenameModalIsOpen(true);
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    removeEssay(user.uid, props.essayId);
    props.setEssayList(
      props.essayList.filter((essay) => essay.essayId !== props.essayId)
    );
  };

  return (
    <Card
      key={props.essayId}
      ref={essayCardRef}
      p="lg"
      radius="lg"
      component="a"
      href="#"
      withBorder
      shadow={"sm"}
      className={classes.documentCard}
      onClick={() => {
        navigate({
          pathname: "/compose",
          search: `?${createSearchParams({ essayId: props.essayId })}`,
        });
      }}
    >
      <Stack spacing={0}>
        <Image src={imgSrc} />
        <Stack>
          <Group mt="md" position="apart">
            <Text className={classes.title} mt={5} lineClamp={1}>
              {props.essayTitle ?? "Untitled Document"}
            </Text>
            <Menu
              transitionDuration={100}
              transition="pop-top-right"
              position="top"
            >
              <Menu.Target>
                <ActionIcon onClick={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
                }} >
                  <IconDots />
                </ActionIcon>
              </Menu.Target>
              <Portal>
                <Menu.Dropdown>
                  <Menu.Item onClick={handleRename}>
                    <Group>
                      <IconTextSize size={20} /> Rename
                    </Group>
                  </Menu.Item>
                  <Menu.Item onClick={handleRemove}>
                    <Group>
                      <IconTrash size={20} /> Remove
                    </Group>
                  </Menu.Item>
                  <Menu.Item onClick={handleOpenInNewTab}>
                    <Group>
                      <IconBrowser size={20} /> Open in new tab
                    </Group>
                  </Menu.Item>
                </Menu.Dropdown>
              </Portal>
            </Menu>
          </Group>
          <Group>
            <IconUsers stroke={"1.75"} />
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Owned by me
              {/* Shared with 2 groups */}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}
