import Navbarcomponent from "@/components/navbar/Navbar";
import React from "react";
import Link from 'next/link';

function page() {
  return (
    <div>
      <div className="h-16">
        <Navbarcomponent />
      </div>
      <div className="mx-auto w-[94%] lg:w-[80%]">
        <h1 className="text-3xl font-bold mt-4 md:mt-8">DMCA - Disclaimer</h1>
        <p className="mt-4 text-[#bdbdbd]">
          Aniplaynow.live is committed to respecting the intellectual property
          rights of others and complying with the Digital Millennium Copyright
          Act (DMCA). We take copyright infringement seriously and will respond
          to notices of alleged copyright infringement that comply with the DMCA
          and any other applicable laws.
        </p>

        <p className="mt-4 text-[#bdbdbd]">
          If you believe that any content on our website is infringing upon your
          copyrights, please send us an email. Please allow up to 2-5 business
          days for a response. Please note that emailing your complaint to other
          parties such as our Internet Service Provider, Hosting Provider, and
          other third parties will not expedite your request and may result in a
          delayed response due to the complaint not being filed properly.
        </p>

        <div className="flex flex-col gap-4 my-4">
          <p className="lg:text-xl font-medium">
            In order for us to process your complaint, please provide the
            following information:
          </p>
          <div className="ml-5">
            <ul className="flex flex-col gap-2 list-disc text-[#bdbdbd]">
              <li>
                A description of the copyrighted work that you claim is being
                infringed;
              </li>
              <li>
                A description of the material you claim is infringing and that
                you want removed or access to which you want disabled with a URL
                and proof you are the original owner or other location of that
                material;
              </li>
              <li>
                Your name, title (if acting as an agent), address, telephone
                number, and email address;
              </li>
              <li>
                The following statement:{" "}
                  "I have a good faith belief that the use of the copyrighted
                  material I am complaining of is not authorized by the
                  copyright owner, its agent, or the law (e.g., as a fair use)";
              </li>
              <li>
                The following statement:{" "}
                  "The information in this notice is accurate and, under penalty
                  of perjury, I am the owner, or authorized to act on behalf of
                  the owner, of the copyright or of an exclusive right that is
                  allegedly infringed";
              </li>
              <li>
                The following statement:{" "}
                  "I understand that I am subject to legal action upon
                  submitting a DMCA request without solid proof.";
              </li>
              <li>
                An electronic or physical signature of the owner of the
                copyright or a person authorized to act on the owner's behalf.
              </li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">NOTE:</h2>
        <p className="mt-4 text-[#bdbdbd]">
          None of the files listed on aniplaynow.live are hosted on our servers. All
          links point to content hosted on third-party websites. gojo.live does
          not accept responsibility for content hosted on third-party websites
          and has no involvement in the downloading/uploading of movies. We only
          post links that are available on the internet. If you believe that any
          content on our website infringes upon your intellectual property
          rights and you hold the copyright for that content, please report it
          to{" "}
          <Link href="mailto:contact@aniplaynow.live" className="text-white">
            contact@aniplaynow.live
          </Link>{" "}
          and the content will be immediately removed.
        </p>
      </div>
    </div>
  );
}

export default page;