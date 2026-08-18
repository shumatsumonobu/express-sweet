FROM amazonlinux:2023

# Build tools. python3/gcc-c++/make are needed when sqlite3 has to fall back to
# node-gyp because no prebuilt binary matches the container.
# curl is not listed: Amazon Linux 2023 ships curl-minimal, and installing the
# full curl package conflicts with it and aborts the image build.
RUN dnf install -y \
      tar \
      xz \
      gzip \
      findutils \
      python3 \
      gcc-c++ \
      make \
    && dnf clean all \
    && rm -rf /var/cache/dnf

# Node from the official tarball rather than a distro package, so the version is
# pinned exactly. The default builds the library, which needs 22. The demos pass
# 18.20.8 instead, to check that the shipped output runs on the minimum version
# declared in the library's `engines` field.
ARG NODE_VERSION=22.23.2
RUN curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
    | tar -xJ -C /usr/local --strip-components=1

# sqlite3 ships prebuilt binaries linked against a newer glibc than Amazon Linux
# 2023 provides (2.34), so loading them fails with "GLIBC_2.38 not found".
# Compile native modules from source instead.
ENV npm_config_build_from_source=true

WORKDIR /app

CMD ["node", "--version"]
