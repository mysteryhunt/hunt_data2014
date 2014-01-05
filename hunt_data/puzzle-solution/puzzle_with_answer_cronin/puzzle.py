#!/usr/bin/python

import sys
import hashlib

"""
Install pysha3:

Download pysha3 from: https://pypi.python.org/pypi/pysha3/0.3#downloads

On Windows, run the installer appropriate for your versions of Windows and Python.

On Linux or Mac, run:
$ python setup.py build
$ sudo python setup.py install
"""

if sys.version_info < (3, 4):
	import sha3

sentences = [
"You're sure to get somewhere, if you only walk long enough.",
"Oh you can't help that. We're all mad here. I'm mad. You're mad.",
"Alice thought the whole thing very SILLY",
]
	
def encode_level(previous_level, algorithm, filehandle = None):
	
	out = ''
	hash = None
	
	# Put a space in front so that every level starts with the hash of the empty string
	previous_level = ' ' + previous_level
	
	for c in previous_level:
		if c == ' ':
			# Divide the data into words, so each space will be
			# encoded as the hash of the empty string
			hash = hashlib.new(algorithm)
		else:
			assert hash is not None
			hash.update(c) # This creates a hash of the word up through character c
		
		if filehandle is None:
			out += hash.hexdigest() # Add this hash to the output stream
		else:
			filehandle.write(hash.hexdigest()) # Append this to the output file
		
	return out

def main(filename):
	level_2 = encode_level(sentences[2], 'sha3_256')
	level_1 = encode_level(sentences[1] + ' ' + level_2, 'sha1')
	with open(filename, 'w') as filehandle:
		encode_level(sentences[0] + ' ' + level_1, 'md5', filehandle)

if __name__ == '__main__':
	main('data.txt')